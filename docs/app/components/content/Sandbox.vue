<script setup lang="ts">
const props = defineProps({
  src: { type: String, default: 'main' },
})

const colorMode = useColorMode()
</script>

<template>
  <div>
    <div class="w-full min-h-[500px] mx-auto mb-6 overflow-hidden text-3xl rounded-md sandbox mt-4">
      <iframe
        :src="`https://stackblitz.com/github/nuxt-modules/tailwindcss/tree/${props.src}?embed=1&theme=${colorMode.value}`"
        title="Sandbox editor (powered by StackBlitz)"
        sandbox="allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
        class="w-full h-full min-h-[700px] overflow-hidden bg-gray-100 dark:bg-gray-800"
      />
    </div>

    <span class="text-sm text-gray-500 dark:text-gray-400">
      Open in <NuxtLink
        :to="`https://github.com/nuxt-modules/tailwindcss/tree/${props.src}`"
        target="_blank"
        class="text-gray-900 dark:text-white"
      >GitHub</NuxtLink>
    </span>
  </div>
</template>

<style lang="postcss" scoped>
.sandbox,
.sandbox iframe {
  @apply w-full rounded-md rounded-tl-none rounded-tr-none overflow-hidden h-64;
  height: 700px;
}
</style>
