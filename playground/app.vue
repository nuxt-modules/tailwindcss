<template>
  <div>
    <div>
      <CallToAction />
    </div>
    <pre>{{ JSON.stringify(tailwindConfig, null, 2) }}</pre>
  </div>
</template>

<script setup>
import tailwindConfig from '#tailwind-config'
</script>
