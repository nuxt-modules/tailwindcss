<template>
  <div>
    <div>
      <CallToAction />
    </div>

    <pre class="p-4 m-4 bg-gray-100 rounded">{{ tailwindConfig }}</pre>
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
