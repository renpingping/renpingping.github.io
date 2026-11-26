import { SITE } from '../site'

const RFC822_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * 把站内路径变成完整的线上地址。
 * 除根路径外一律补上尾斜杠：GitHub Pages 实际提供的地址带尾斜杠，不带的会被 301 过去，
 * canonical 与站点地图应该指向最终地址。
 */
export function toSiteUrl(path: string): string {
  const [pathname = '/', search = ''] = path.split('?')
  const normalized = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`
  // 路由给出的路径可能已经是编码过的。逐段先解码再编码，保证同一地址只会有一种写法。
  // 必须用 decodeURIComponent：decodeURI 不解码 + / # & 等地址保留字符，它们随后会被再编码一次。
  // 先按 / 切段再解码，这样标签里的斜杠（%2F）不会被当成路径分隔符。
  const encoded = normalized.split('/').map(encodeSegment).join('/')
  return `${SITE.url}${encoded}${search ? `?${search}` : ''}`
}

function encodeSegment(segment: string): string {
  if (!segment)
    return ''
  try {
    return encodeURIComponent(decodeURIComponent(segment))
  }
  catch {
    // 段里有不成对的 %，不是合法的编码，按原样编码
    return encodeURIComponent(segment)
  }
}

/** ISO 日期转 RSS 使用的 RFC 822 格式（GMT）。无法识别时返回空字符串 */
export function toRfc822Date(iso?: string | null): string {
  if (!iso)
    return ''
  const time = Date.parse(iso)
  if (Number.isNaN(time))
    return ''
  const date = new Date(time)
  const pad = (value: number) => String(value).padStart(2, '0')
  const clock = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
  return `${RFC822_DAY[date.getUTCDay()]}, ${pad(date.getUTCDate())} ${MONTH[date.getUTCMonth()]} ${date.getUTCFullYear()} ${clock} GMT`
}
