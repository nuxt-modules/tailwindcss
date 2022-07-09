<template>
  <div>
    <div>
      <CallToAction />
    </div>
    <div class="p-4 max-w-screen-lg mx-auto space-y-4">
      <div>
        <span class="font-medium pr-1">This is a HMR test, try changing the color:</span>
        <span class="text-indigo-500">meow!</span>
      </div>
      <div>
        <span class="font-semibold text-sm text-gray-700">Resolved tailwind config:</span>
        <textarea
          class="p-4 block text-sm border border-gray-100 rounded shadow w-full h-[32rem] font-mono outline-none"
          readonly
          :value="JSON.stringify(tailwindConfig, null, 2)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import tailwindConfig from '#tailwind-config'
</script>
