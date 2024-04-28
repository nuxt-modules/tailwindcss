<template>
  <div class="test">
    PostCSS <span class="test_gray">Color Gray</span> is
    <span class="test_working">working</span>!
    <NuxtLink to="/about" class="text-blue-500 underline">About page</NuxtLink>
  </div>
</template>

<style lang="postcss">
.test {
  color: rgb(40, 176, 218);
  @apply p-4;

  &_working {
    @apply text-green-500;
  }

  &_gray {
    color: gray(50);
  }
}
</style>
