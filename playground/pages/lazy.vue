<template>
  <div>
    <p class="bg-black text-white rounded-md">
      Lazy load tailwind:
    </p>
    <button
      type="button"
      @click="loadTailwindStyles"
    >
      Load tailwind styles
    </button>
  </div>
</template>

<script setup>
import { useTailwind } from '#imports'

const { loadTailwindStyles } = useTailwind()
</script>
