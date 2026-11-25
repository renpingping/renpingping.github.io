<script setup lang="ts">
const { data: projects } = await useAsyncData('projects-list', () =>
  queryCollection('projects').order('date', 'DESC').all(),
)

const sorted = computed(() => {
  const list = projects.value ?? []
  return [...list.filter(p => p.featured), ...list.filter(p => !p.featured)]
})

usePageSeo(() => ({ title: 'Demo', description: '做过的项目与 Demo' }))
</script>

<template>
  <div>
    <PageHeader
      title="Demo"
      description="做过的项目与 Demo"
    />
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="p in sorted"
        :key="p.stem"
        :project="p"
      />
    </div>
  </div>
</template>
