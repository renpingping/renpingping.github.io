import type { Ref, ComputedRef } from 'vue'
import { computed } from 'vue'
import type { Section } from '~/config/sections'
import { getSection, pageSizeOf, sections } from '~/config/sections'
import type { PostSummary } from '~/types/post'
import { POST_SUMMARY_FIELDS } from '~/types/post'
import { pageCount } from '~/utils/pagination'
import { canShowPost, normalizePath, surroundOf } from '~/utils/posts'

const HOME_POST_COUNT = 4

/** 文章摘要列表：数据尚未取到时为 null 或 undefined，调用方用 `?? []` 兜底 */
type PostListRef = Ref<PostSummary[] | null | undefined>

/** 页面里直接使用的 asyncData 结果 */
interface AsyncPosts {
  data: PostListRef
}

/** 列表页的一页数据 */
interface PagedPosts {
  data: PostListRef
  totalPages: ComputedRef<number>
}

/** 某个板块内已发布文章（不含草稿）的摘要，按日期从新到旧 */
function sectionQuery(section: Section) {
  return queryCollection('posts')
    .where('path', 'LIKE', `/${section.key}/%`)
    .where('draft', '=', false)
    .select(...POST_SUMMARY_FIELDS)
    .order('date', 'DESC')
}

/** 该板块全部已发布文章的摘要（不含草稿与正文），按日期从新到旧 */
function useAllSectionPosts(section: Section): AsyncPosts {
  return useAsyncData(`${section.key}-all`, () => sectionQuery(section).all())
}

/** 某个板块某一页的已发布文章摘要与总页数。在数据层分页：只取这一页需要的条数 */
export async function useSectionPosts(section: Section, page: number): Promise<PagedPosts> {
  const size = pageSizeOf(section)
  // Nuxt 的 composable 必须在第一个 await 之前同步调用
  const total = useAsyncData(`${section.key}-count`, () => sectionQuery(section).count())
  const list = useAsyncData(`${section.key}-list-${page}`, () =>
    sectionQuery(section).skip((page - 1) * size).limit(size).all(),
  )
  await Promise.all([total, list])
  return { data: list.data, totalPages: computed(() => pageCount(total.data.value ?? 0, size)) }
}

/** 列表首页（/<板块>）的数据 */
export async function useSectionFirstPage(key: string): Promise<PagedPosts> {
  return useSectionPosts(getSection(key), 1)
}

/**
 * 分页路由 /<板块>/page/<页码> 的数据。第 1 页重定向到列表首页（避免同一内容两个地址），越界的页码返回 404。
 */
export async function useSectionPage(key: string): Promise<PagedPosts> {
  const section = getSection(key)
  const requested = Number.parseInt(String(useRoute().params.page ?? ''), 10)
  // 必须在任何 await 之前调用
  if (requested === 1)
    return navigateTo(`/${section.key}`, { redirectCode: 301 }) as never

  const posts = await useSectionPosts(section, Number.isInteger(requested) && requested >= 1 ? requested : 1)
  if (!Number.isInteger(requested) || requested < 1 || requested > posts.totalPages.value)
    throw createError({ statusCode: 404, statusMessage: '页码不存在' })
  return posts
}

/** 全部板块已发布文章的摘要（不含草稿与正文），按日期从新到旧。数据键由调用方指定，每个页面各自预渲染 */
export function useAllPosts(key: string): AsyncPosts {
  return useAsyncData(key, () =>
    queryCollection('posts')
      .where('draft', '=', false)
      .select(...POST_SUMMARY_FIELDS)
      .order('date', 'DESC')
      .all(),
  )
}

/** 首页的「最新文章」：在登记了 homeFeed 的板块里取最新的几篇 */
export function useHomePosts(): AsyncPosts {
  return useAsyncData('home-posts', async () => {
    const feeds = await Promise.all(
      sections
        .filter(section => section.homeFeed)
        .map(section => sectionQuery(section).limit(HOME_POST_COUNT).all()),
    )
    return feeds.flat().sort((a, b) => b.date.localeCompare(a.date)).slice(0, HOME_POST_COUNT)
  })
}

/**
 * 文章详情页的数据：文章本身，以及同一板块内按日期相邻的两篇。
 * 需要在页面的 setup 里 await；文章不存在或不属于该板块时抛出 404。
 */
export async function usePostPage(section: Section) {
  // GitHub Pages 的规范地址带尾斜杠，路由给出的路径会保留它。统一去掉尾斜杠，
  // 数据键才能对上预渲染的页面数据（否则会在浏览器里重新查询），路径比较才可靠。
  const path = normalizePath(useRoute().path)

  // Nuxt 的 composable 必须在第一个 await 之前同步调用
  const postFetch = useAsyncData(path, () =>
    queryCollection('posts').path(path).first(),
  )
  const { data: siblings } = useAllSectionPosts(section)

  const { data: post } = await postFetch

  // 合并集合后文章路径全局唯一，但页面只能展示自己板块下的文章；草稿同样不可见
  if (!canShowPost(post.value, section.key))
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })

  const surround = computed(() =>
    section.surround ? surroundOf(siblings.value ?? [], path) : { newer: null, older: null },
  )

  return {
    post,
    newer: computed(() => surround.value.newer),
    older: computed(() => surround.value.older),
  }
}
