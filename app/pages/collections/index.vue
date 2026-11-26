<script setup lang="ts">
const { data: items } = await useAsyncData('collections-list', () =>
  queryCollection('collections').order('date', 'DESC').all(),
)

const { activeTag, allTags, filtered } = useTagFilter(items)

usePageSeo(() => ({ title: '收藏', description: '读过并想留住的好文章与好资源' }))
</script>

<template>
  <div>
    <PageHeader
      title="收藏"
      description="读过并想留住的好文章与好资源"
    />

    <TagFilter
      v-model:active="activeTag"
      :tags="allTags"
    />

    <div class="grid gap-4">
      <CollectionCard
        v-for="item in filtered"
        :key="item.stem"
        :item="item"
      />
    </div>

    <p
      v-if="!filtered.length"
      class="py-16 text-center text-sm text-muted"
    >暂无收藏</p>
  </div>
</template>
