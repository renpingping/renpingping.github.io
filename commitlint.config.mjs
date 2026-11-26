/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // post / weekly 是文章机器人沿用的类型，历史上一直在用；人提交内容改动时用 content
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'content',
        'post',
        'weekly',
      ],
    ],
    // 主题多为中文，大小写规则没有意义；英文主题也不强制小写
    'subject-case': [0],
  },
}
