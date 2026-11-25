/**
 * 依赖审计的判定逻辑（纯函数，便于测试）。
 * 输入是 `npm audit --json` 的输出与仓库的 audit-allowlist.json，输出哪些公告可以放行、哪些必须让门禁失败。
 */

/** 严重级别从低到高 */
export const SEVERITY_ORDER = ['info', 'low', 'moderate', 'high', 'critical']

/**
 * 校验白名单并按公告 id 建索引。
 * 条目必须写明理由和可识别的到期日，否则抛错——不允许无说明、无期限地放行。
 * @param {unknown} allowlist
 * @returns {Map<string, { until: number }>} 公告 id → 到期日（UTC 零点的时间戳）
 */
function indexAllowlist(allowlist) {
  const entries = /** @type {any} */ (allowlist)?.advisories
  if (!Array.isArray(entries))
    throw new Error('audit-allowlist.json 需要有 advisories 数组')

  const index = new Map()
  for (const entry of entries) {
    if (!entry?.id)
      throw new Error(`白名单条目缺少 id：${JSON.stringify(entry)}`)
    if (typeof entry.reason !== 'string' || !entry.reason.trim())
      throw new Error(`白名单条目 ${entry.id} 缺少 reason（放行理由）`)
    const until = Date.parse(`${String(entry.until)}T00:00:00Z`)
    if (!entry.until || Number.isNaN(until))
      throw new Error(`白名单条目 ${entry.id} 的 until 不是有效日期（应为 YYYY-MM-DD）：${entry.until}`)
    index.set(entry.id, { until })
  }
  return index
}

/**
 * @param {unknown} report `npm audit --json` 的输出
 * @param {unknown} allowlist audit-allowlist.json 的内容
 * @param {Date} today 用于判断白名单是否到期（到期日当天仍有效）
 */
export function evaluateAudit(report, allowlist, today) {
  const allowed = indexAllowlist(allowlist)
  const todayStart = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

  /** @type {Map<string, { severity: string, packages: Set<string> }>} */
  const found = new Map()
  for (const [pkg, vuln] of Object.entries(/** @type {any} */ (report)?.vulnerabilities ?? {})) {
    for (const via of vuln?.via ?? []) {
      // via 是包名时表示经其它包传导，公告本身记在那个包上，这里不重复计入
      if (typeof via === 'string')
        continue
      const id = String(via.url).split('/').pop()
      const hit = found.get(id) ?? { severity: SEVERITY_ORDER[0], packages: new Set() }
      if (SEVERITY_ORDER.indexOf(via.severity) > SEVERITY_ORDER.indexOf(hit.severity))
        hit.severity = via.severity
      hit.packages.add(pkg)
      found.set(id, hit)
    }
  }

  const packagesOf = id => [...found.get(id).packages].sort()
  const accepted = []
  const unexpected = []
  const expired = []
  for (const id of [...found.keys()].sort()) {
    const entry = allowed.get(id)
    if (!entry)
      unexpected.push({ id, severity: found.get(id).severity, packages: packagesOf(id) })
    else if (entry.until < todayStart)
      expired.push({ id, packages: packagesOf(id) })
    else
      accepted.push(id)
  }
  const stale = [...allowed.keys()].filter(id => !found.has(id)).sort()

  return { ok: unexpected.length === 0 && expired.length === 0, accepted, unexpected, expired, stale }
}
