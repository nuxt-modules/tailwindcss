<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const navigation = inject<NavItem[]>('navigation', [])

const { header } = useAppConfig()
</script>

<template>
  <UHeader>
    <template #logo>
      <Logo class="h-6" />
      <span class="text-xs font-thin">v{{ header.pkgVersion }}</span>
    </template>

    <template v-if="header?.search" #center>
      <UDocsSearchButton class="hidden lg:flex" />
    </template>

    <template #right>
      <UDocsSearchButton v-if="header?.search" :label="null" class="lg:hidden" />

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'gray', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>
