<script setup lang="ts">
import { DEFAULT_PAGE_SIZE } from '~/config/sections'

const route = useRoute()
// Vue Router 返回的 params 已解码，切勿再 decodeURIComponent（否则标签含 % 等字符会抛 URIError）
const tag = computed(() => route.params.tag as string)

const { data: posts } = await useAllPosts(`tag-${tag.value}`)
const matched = computed(() => filterByTag(posts.value ?? [], tag.value))

if (!matched.value.length) {
  throw createError({ statusCode: 404, statusMessage: '标签不存在' })
}

// 标签页在浏览器里分页（?page=N）：数据本来就是一次取回的，不必为每一页生成一个文件
const totalPages = computed(() => pageCount(matched.value.length, DEFAULT_PAGE_SIZE))
const page = computed(() => pageFromQuery(route.query.page, totalPages.value))
const visible = computed(() =>
  matched.value.slice((page.value - 1) * DEFAULT_PAGE_SIZE, page.value * DEFAULT_PAGE_SIZE),
)
const pageHref = (target: number) => ({ query: { ...route.query, page: target === 1 ? undefined : String(target) } })

usePageSeo(() => ({
  title: `标签：${tag.value}`,
  description: `带有「${tag.value}」标签的全部文章`,
}))

// 翻页后回到页面顶部
watch(page, () => window.scrollTo({ top: 0 }))
</script>

<template>
  <div>
    <header class="mb-8">
      <p class="text-sm text-muted">标签</p>
      <h1 class="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100"># {{ tag }}</h1>
    </header>

    <PostGrid :posts="visible" />

    <Pagination
      :page="page"
      :total-pages="totalPages"
      :href="pageHref"
    />
  </div>
</template>
