/**
 * Perlin 改进型噪声（Ken Perlin，2002）的三维实现，输出映射到 0–1。
 * 背景动效原来靠 p5i 提供噪声；这个文件用几十行原生实现替代那个 1MB 的依赖。
 */

/**
 * 生成 0–255 的一个随机排列；相同种子得到相同结果。
 * 用 xorshift 产生随机数，再用 Fisher–Yates 洗牌。
 */
export function createPermutation(seed: number): Uint8Array {
  const table = Uint8Array.from({ length: 256 }, (_, i) => i)
  let state = seed >>> 0 || 0x9E3779B9
  const next = () => {
    state ^= state << 13
    state >>>= 0
    state ^= state >>> 17
    state ^= state << 5
    state >>>= 0
    return state
  }
  for (let i = 255; i > 0; i--) {
    const j = next() % (i + 1)
    const current = table[i]!
    table[i] = table[j]!
    table[j] = current
  }
  return table
}

/**
 * 创建三维噪声函数 noise(x, y, z)，返回值在 0–1 之间，整数格点上恒为 0.5。
 * @param permutation 长度为 256 的排列，见 createPermutation
 */
export function createNoise3D(permutation: Uint8Array): (x: number, y: number, z: number) => number {
  // 重复一份，省去取模
  const p = new Uint8Array(512)
  for (let i = 0; i < 512; i++)
    p[i] = permutation[i & 255]!

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (t: number, a: number, b: number) => a + t * (b - a)
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  return (x, y, z) => {
    const cornerX = Math.floor(x) & 255
    const cornerY = Math.floor(y) & 255
    const cornerZ = Math.floor(z) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    z -= Math.floor(z)
    const u = fade(x)
    const v = fade(y)
    const w = fade(z)
    const a = p[cornerX]! + cornerY
    const aa = p[a]! + cornerZ
    const ab = p[a + 1]! + cornerZ
    const b = p[cornerX + 1]! + cornerY
    const ba = p[b]! + cornerZ
    const bb = p[b + 1]! + cornerZ

    const raw = lerp(
      w,
      lerp(
        v,
        lerp(u, grad(p[aa]!, x, y, z), grad(p[ba]!, x - 1, y, z)),
        lerp(u, grad(p[ab]!, x, y - 1, z), grad(p[bb]!, x - 1, y - 1, z)),
      ),
      lerp(
        v,
        lerp(u, grad(p[aa + 1]!, x, y, z - 1), grad(p[ba + 1]!, x - 1, y, z - 1)),
        lerp(u, grad(p[ab + 1]!, x, y - 1, z - 1), grad(p[bb + 1]!, x - 1, y - 1, z - 1)),
      ),
    )
    return (raw + 1) / 2
  }
}
