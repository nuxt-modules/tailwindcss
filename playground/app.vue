<template>
  <div>
    <div>
      <CallToAction />
    </div>
    <div class="p-4">
      <pre>{{ JSON.stringify(tailwindConfig, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import tailwindConfig from '#tailwind-config'
</script>
