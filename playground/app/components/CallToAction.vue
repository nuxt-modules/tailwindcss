<template>
  <div class="bg-gray-50">
    <div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
      <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span class="block">Ready to dive in?</span>
        <span class="description block">Welcome to Nuxt Tailwind playground</span>
      </h2>
    </div>
  </div>
</template>

<style>
@reference '#tailwindcss';

h2 {
  .description {
    @apply text-indigo-600;
    &:hover {
      @apply text-teal-600;
    }
  }
}
</style>
