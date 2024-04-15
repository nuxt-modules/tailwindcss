<template>
  <div>
    <div>
      <CallToAction />
    </div>
    <pre>{{ JSON.stringify(tailwindConfig, null, 2) }}</pre>
  </div>
</template>

<script>
import tailwindConfig from '#tailwind-config'

export default {
  computed: {
    tailwindConfig: () => tailwindConfig,
  },
}
</script>
