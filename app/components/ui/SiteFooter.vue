<script setup lang="ts">
const config = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-zinc-200/70 py-8 dark:border-zinc-800/70">
    <div class="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center text-sm text-zinc-500 sm:px-6">
      <div class="flex items-center gap-4">
        <a
          :href="config.site.socials[0].url"
          target="_blank"
          rel="noopener"
          class="transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
        >GitHub</a>
        <NuxtLink to="/about" class="transition-colors hover:text-zinc-800 dark:hover:text-zinc-200">
          关于
        </NuxtLink>
      </div>
      <p>© {{ year }} {{ config.site.author }} · Powered by <a href="https://nuxt.com" target="_blank" rel="noopener" class="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-800 dark:hover:text-zinc-200">Nuxt</a></p>
    </div>
  </footer>
</template>
