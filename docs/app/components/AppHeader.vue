<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const navigation = inject<NavItem[]>('navigation', [])

const { header } = useAppConfig()
</script>

<template>
  <UHeader>
    <template #logo>
      <TheLogo class="h-6" />
      <UTooltip
        v-if="header.pkgVersion"
        :text="`Latest release: v${header.pkgVersion}`"
      >
        <UBadge
          variant="subtle"
          size="xs"
          class="-mb-[2px] rounded font-semibold"
        >
          v{{ header.pkgVersion.match(/[0-9]+\.[0-9]+/)[0] }}
        </UBadge>
      </UTooltip>
    </template>

    <template
      v-if="header?.search"
      #center
    >
      <UContentSearchButton class="hidden lg:flex" />
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        :label="null"
        class="lg:hidden"
      />

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
