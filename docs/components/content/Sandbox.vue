<template>
  <div class="w-full min-h-[500px] mx-auto mb-6 overflow-hidden text-3xl rounded-md sandbox mt-4">
    <iframe
      v-if="url"
      :src="url"
      title="Sandbox editor"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      class="w-full h-full min-h-[700px] overflow-hidden bg-gray-100 dark:bg-gray-800"
    />
    <span v-else class="flex-1 text-white">Loading Sandbox...</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  repo: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  dir: {
    type: String,
    default: ''
  },
  file: {
    type: String,
    default: 'app.vue'
  }
})

const colorMode = useColorMode()
const url = ref('')

onMounted(() => {
  url.value = props.src || `https://stackblitz.com/github/${props.repo}/tree/${props.branch}/${props.dir}?embed=1&file=${props.file}&theme=${colorMode.value}`
})
</script>

<style lang="postcss" scoped>
.sandbox,
.sandbox iframe {
  @apply w-full rounded-md rounded-tl-none rounded-tr-none overflow-hidden h-64;
  height: 700px;
}
</style>
