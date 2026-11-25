import type { Ref } from 'vue'
import { computed } from 'vue'
import type { Section } from '~/config/sections'
import { belongsSection, sections } from '~/config/sections'
import type { PostSummary } from '~/types/post'
import { POST_SUMMARY_FIELDS } from '~/types/post'
import { surroundOf } from '~/utils/posts'

const HOME_POST_COUNT = 4

/** 页面里直接使用的 asyncData 结果 */
interface AsyncPosts {
  data: Ref<PostSummary[] | null>
}

/** 某个板块内已发布文章（不含草稿）的摘要，按日期从新到旧 */
function sectionQuery(section: Section) {
  return queryCollection('posts')
    .where('path', 'LIKE', `/${section.key}/%`)
    .where('draft', '=', false)
    .select(...POST_SUMMARY_FIELDS)
    .order('date', 'DESC')
}

/** 某个板块全部已发布文章的摘要（不含草稿与正文） */
export function useSectionPosts(section: Section): AsyncPosts {
  return useAsyncData(`${section.key}-list`, () => sectionQuery(section).all())
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
  const route = useRoute()
  const path = route.path

  // Nuxt 的 composable 必须在第一个 await 之前同步调用：普通 async 函数一旦 await，当前实例的上下文就没了
  const postFetch = useAsyncData(path, () =>
    queryCollection('posts').path(path).first(),
  )
  const { data: siblings } = useSectionPosts(section)

  const { data: post } = await postFetch

  // 合并集合后文章路径全局唯一，但页面只能展示自己板块下的文章：跨板块访问按 404 处理；草稿同样不可见
  if (!post.value || !belongsSection(path, section.key) || post.value.draft === true)
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
