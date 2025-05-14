<template>
  <div>
    <div>
      <CallToAction />
    </div>
    <div :class="mainDivClass">
      <div>
        <span class="pr-1 font-medium">This is a HMR test, try changing the color:</span>
        <span class="text-blue-500">meow!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tw } from '#imports'
// const tw = <T>(s: T) => s
const mainDivClass = tw`max-w-screen-lg p-4 mx-auto space-y-4`
</script>
