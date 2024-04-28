<template>
  <div class="p-4">
    <h1 class="text-5xl">About page</h1>
    <p>
      <NuxtLink to="/" class="text-blue-500 underline">Home page</NuxtLink>
    </p>
    <h3 class="text-3xl mt-2">Tailwind config:</h3>
    <pre class="bg-gray-200 p-3 rounded">{{ tailwindConfig }}</pre>
  </div>
</template>

<script setup>
import tailwindConfig from "#tailwind-config";
</script>
