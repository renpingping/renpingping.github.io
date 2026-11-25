<script setup lang="ts">
import { getSection } from '~/config/sections'

// 页面自己声明背景（见 layouts/default.vue）：长文阅读页用流场，其余页面用分支生长
definePageMeta({ background: 'flow' })

const section = getSection('blog')
</script>

<template>
  <PostPage :section="section" />
</template>
