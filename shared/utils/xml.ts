/** 转义 XML 的五个特殊字符，用于站点地图与 RSS */
export function escapeXml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ENTITIES[char]!)
}

const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
}
