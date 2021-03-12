<template>
  <div>
    <div>
      <CallToAction />
    </div>

    <pre class="p-2 m-4 bg-gray-100 rounded">{{ JSON.stringify(tailwindConfig, null, 2) }}</pre>
  </div>
</template>

<script>
import tailwindConfig from '~tailwind.config'

export default {
  data () {
    return { tailwindConfig }
  }
}
</script>
