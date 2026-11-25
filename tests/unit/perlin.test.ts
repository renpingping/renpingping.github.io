import { describe, expect, it } from 'vitest'
import { createNoise3D, createPermutation } from '~/utils/perlin'

// Ken Perlin 公开的参考置换表，只用于和独立实现的参照值对比；应用运行时用的是带种子的随机排列
const reference = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
  190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125,
  136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41,
  55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188,
  159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59,
  227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129,
  22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179,
  162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150,
  254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
]

describe('createNoise3D', () => {
  const noise = createNoise3D(Uint8Array.from(reference))

  it('与 Perlin 改进型噪声的参考实现一致，结果映射到 0–1', () => {
    // 期望值由独立的参考实现（Ken Perlin 2002 年公开算法的逐行移植）在同一置换表下算出
    expect(noise(0.5, 0.5, 0.5)).toBeCloseTo(0.375, 9)
    expect(noise(1.3, 2.7, 0.1)).toBeCloseTo(0.6154219865, 9)
    expect(noise(-0.4, 3.2, 5.5)).toBeCloseTo(0.7540054093, 9)
    expect(noise(10.25, 20.5, 30.75)).toBeCloseTo(0.4562788010, 9)
    expect(noise(100.75, -50.25, 0.333)).toBeCloseTo(0.5264540936, 9)
  })

  it('整数格点上的值为 0.5（原始噪声为零），包括负坐标与超过 255 的坐标', () => {
    for (const [x, y, z] of [[3, 7, 11], [-4, 0, 260], [512, -300, 9]])
      expect(noise(x!, y!, z!)).toBeCloseTo(0.5, 9)
  })

  it('输入相近时输出相近，没有跳变', () => {
    let state = 42
    const next = () => (state = (state * 16807) % 2147483647) / 2147483647
    for (let i = 0; i < 50; i++) {
      const x = next() * 40 - 20
      const y = next() * 40 - 20
      const z = next() * 40 - 20
      expect(Math.abs(noise(x + 0.01, y, z) - noise(x, y, z))).toBeLessThan(0.06)
      expect(Math.abs(noise(x, y, z + 0.01) - noise(x, y, z))).toBeLessThan(0.06)
    }
  })

  it('在大范围与负坐标上都有起伏，上下界与参考实现一致', () => {
    const values: number[] = []
    for (let i = -50; i < 50; i += 2)
      values.push(noise(i * 0.37, i * -1.13, i * 0.05))
    // 期望值由独立的参考实现在同一条直线上算出
    expect(Math.min(...values)).toBeCloseTo(0.2742039389, 9)
    expect(Math.max(...values)).toBeCloseTo(0.7440739462, 9)
  })
})

describe('createPermutation', () => {
  it('生成 0–255 的一个排列', () => {
    const permutation = [...createPermutation(7)].sort((a, b) => a - b)
    expect(permutation).toHaveLength(256)
    expect(permutation[0]).toBe(0)
    expect(permutation[255]).toBe(255)
    expect(new Set(permutation).size).toBe(256)
  })

  it('相同的种子得到相同的排列，不同的种子得到不同排列', () => {
    expect([...createPermutation(1)]).toEqual([...createPermutation(1)])
    expect([...createPermutation(1)]).not.toEqual([...createPermutation(2)])
  })
})
