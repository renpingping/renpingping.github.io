import { describe, expect, it } from 'vitest'
import { evaluateAudit } from '../../scripts/lib/audit-report.mjs'

interface AuditPackage {
  severity: string
  via: ({ url: string, severity: string } | string)[]
}

// npm audit --json 的最小样本：每个包经 via 指向具体公告对象，或经包名字符串指向另一个受影响的包
const advisory = (id: string, severity = 'high') => ({ url: `https://github.com/advisories/${id}`, severity })
const report = (vulnerabilities: Record<string, AuditPackage>) => ({ vulnerabilities })

const allowlist = {
  advisories: [
    { id: 'GHSA-zod', package: 'zod', reason: '只在构建期解析本地内容', until: '2027-05-31' },
    { id: 'GHSA-old', package: 'minimatch', reason: '等待上游发版', until: '2026-01-01' },
    { id: 'GHSA-gone', package: 'archiver', reason: '上游已修复', until: '2027-05-31' },
  ],
}
const today = new Date('2026-11-25T09:00:00Z')

describe('evaluateAudit', () => {
  it('没有任何公告时通过，并把已不再被报告的白名单项列为待清理', () => {
    expect(evaluateAudit(report({}), allowlist, today)).toEqual({
      ok: true,
      accepted: [],
      unexpected: [],
      expired: [],
      stale: ['GHSA-gone', 'GHSA-old', 'GHSA-zod'],
    })
  })

  it('白名单内且未到期的公告通过', () => {
    const result = evaluateAudit(report({ zod: { severity: 'high', via: [advisory('GHSA-zod')] } }), allowlist, today)
    expect(result).toEqual({
      ok: true,
      accepted: ['GHSA-zod'],
      unexpected: [],
      expired: [],
      stale: ['GHSA-gone', 'GHSA-old'],
    })
  })

  it('经其它包传导到同一公告时不重复计入', () => {
    const result = evaluateAudit(
      report({
        content: { severity: 'high', via: ['zod'] },
        zod: { severity: 'high', via: [advisory('GHSA-zod')] },
      }),
      allowlist,
      today,
    )
    expect(result.ok).toBe(true)
    expect(result.accepted).toEqual(['GHSA-zod'])
  })

  it('白名单外的公告导致失败，并带上严重级别与受影响的包', () => {
    const result = evaluateAudit(
      report({ nuxt: { severity: 'moderate', via: [advisory('GHSA-new', 'moderate')] } }),
      allowlist,
      today,
    )
    expect(result.ok).toBe(false)
    expect(result.unexpected).toEqual([{ id: 'GHSA-new', severity: 'moderate', packages: ['nuxt'] }])
  })

  it('同一公告出现在多个包里时合并，并取最高的严重级别', () => {
    const result = evaluateAudit(
      report({
        a: { severity: 'low', via: [advisory('GHSA-new', 'low')] },
        b: { severity: 'high', via: [advisory('GHSA-new', 'high')] },
      }),
      allowlist,
      today,
    )
    expect(result.unexpected).toEqual([{ id: 'GHSA-new', severity: 'high', packages: ['a', 'b'] }])
  })

  it('白名单条目到期后，它对应的公告重新算作未处理', () => {
    const result = evaluateAudit(
      report({ minimatch: { severity: 'moderate', via: [advisory('GHSA-old', 'moderate')] } }),
      allowlist,
      today,
    )
    expect(result.ok).toBe(false)
    expect(result.expired).toEqual([{ id: 'GHSA-old', packages: ['minimatch'] }])
    expect(result.unexpected).toEqual([])
  })

  it('到期日当天仍然有效', () => {
    const dueToday = { advisories: [{ id: 'GHSA-due', package: 'p', reason: 'r', until: '2026-11-25' }] }
    const result = evaluateAudit(report({ p: { severity: 'high', via: [advisory('GHSA-due')] } }), dueToday, today)
    expect(result).toMatchObject({ ok: true, accepted: ['GHSA-due'] })
  })

  it('白名单条目缺少理由时直接报错，避免无说明地放行', () => {
    const broken = { advisories: [{ id: 'GHSA-x', package: 'p', until: '2027-01-01' }] }
    expect(() => evaluateAudit(report({}), broken, today)).toThrow(/reason/)
  })

  it('白名单条目的到期日无法识别时直接报错', () => {
    const broken = { advisories: [{ id: 'GHSA-x', package: 'p', reason: 'r', until: 'forever' }] }
    expect(() => evaluateAudit(report({}), broken, today)).toThrow(/until/)
  })
})
