export default defineAppConfig({
  site: {
    name: 'ther',
    author: 'renpingping',
    // 首页标语
    tagline: '明年依然好时节，扬帆再赴星辰约',
    // 源码仓库（source 分支为开发分支，master 为构建产物）
    repo: 'https://github.com/renpingping/renpingping.github.io/tree/source',
    socials: [
      { label: 'GitHub', url: 'https://github.com/renpingping' },
    ],
  },

  // 关于页的文案与技能数据
  about: {
    role: 'Software Engineer',
    intro: '记录技术笔记、项目作品和读过的好的文章。',
    skills: [
      { name: 'JavaScript', percent: 88 },
      { name: 'HTML5 / CSS3', percent: 80 },
      { name: 'Vue', percent: 90 },
      { name: 'React', percent: 92 },
      { name: 'SQL', percent: 72 },
      { name: '产品设计', percent: 88 },
    ],
  },
})
