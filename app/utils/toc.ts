/** Nuxt Content 为文章生成的标题树里的一项 */
export interface TocLink {
  id: string
  depth: number
  text: string
  children?: TocLink[]
}

/** 把嵌套的标题树按文档顺序摊平成一层，保留每个标题自己的层级（用于缩进） */
export function flattenToc(links: readonly TocLink[]): Omit<TocLink, 'children'>[] {
  return links.flatMap(({ id, depth, text, children }) => [
    { id, depth, text },
    ...flattenToc(children ?? []),
  ])
}
