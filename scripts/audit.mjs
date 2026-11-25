#!/usr/bin/env node
// 依赖审计门禁：出现白名单之外的公告、或白名单条目到期时，退出码为 1。
// 判定规则在 ./lib/audit-report.mjs，放行名单与理由在仓库根目录的 audit-allowlist.json。
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { evaluateAudit } from './lib/audit-report.mjs'

const allowlistPath = new URL('../audit-allowlist.json', import.meta.url)
const allowlist = JSON.parse(readFileSync(allowlistPath, 'utf8'))

const audit = spawnSync('npm', ['audit', '--json'], { encoding: 'utf8' })
// 有漏洞时 npm audit 的退出码非 0，但 stdout 仍是完整的 JSON
if (audit.error || !audit.stdout) {
  console.error(`无法运行 npm audit：${audit.error?.message ?? audit.stderr}`)
  process.exit(2)
}

const result = evaluateAudit(JSON.parse(audit.stdout), allowlist, new Date())
console.log(`依赖审计：${result.accepted.length + result.unexpected.length + result.expired.length} 条公告，${result.accepted.length} 条在白名单内`)

for (const id of result.accepted)
  console.log(`  放行  ${id}`)

for (const { id, severity, packages } of result.unexpected) {
  console.error(`  未处理  ${id}（${severity}）：${packages.join('、')}`)
  console.error('          先尝试修复依赖；确认不影响本项目后，再加入 audit-allowlist.json 并写明理由与到期日')
}

for (const { id, packages } of result.expired) {
  console.error(`  已到期  ${id}：${packages.join('、')}`)
  console.error('          白名单条目已过到期日，请重新评估：已修复则从 audit-allowlist.json 删除，仍需放行则更新理由与到期日')
}

for (const id of result.stale)
  console.warn(`  可清理  ${id}：已不再被报告，建议从 audit-allowlist.json 删除`)

process.exit(result.ok ? 0 : 1)
