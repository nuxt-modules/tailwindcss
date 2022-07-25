<template>
  <button class="btn btn-blue">
    <slot>Button</slot>
  </button>
</template>

<style lang="postcss" scoped>
.btn {
  @apply font-bold py-2 px-4 rounded;
  &.btn-blue {
    @apply bg-blue-500 text-white;
    &:hover {
      @apply bg-blue-700;
    }
  }
}
</style>
