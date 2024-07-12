<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter>
    <template #left>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        © 2024 | <NuxtLink
          to="https://github.com/nuxt-modules/tailwindcss/blob/main/LICENSE"
          target="_blank"
          class="text-gray-900 dark:text-white"
        >MIT License</NuxtLink> | v{{ footer.pkgVersion }}
      </span>
    </template>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />

      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ color: 'gray', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
