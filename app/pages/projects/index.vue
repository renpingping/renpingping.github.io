<script setup lang="ts">
const { data: projects } = await useAsyncData('projects-list', () =>
  queryCollection('projects').order('date', 'DESC').all(),
)

const sorted = computed(() => {
  const list = projects.value ?? []
  return [...list.filter(p => p.featured), ...list.filter(p => !p.featured)]
})

useHead({ title: 'Demo' })
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Demo</h1>
      <p class="mt-2 text-sm text-zinc-500">做过的项目与 Demo</p>
    </header>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="p in sorted"
        :key="p.stem"
        :project="p"
      />
    </div>
  </div>
</template>
