<template>
  <div>
    <div class="max-w-sm rounded overflow-hidden shadow-lg mb-4">
      <div class="px-6 py-4 pb-2">
        <div class="text-customcolor">
          this text is a custom red color
        </div>
      </div>
      <div class="px-6 py-4">
        <span class="badge mr-2">this is red in css using apply</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge {
  @apply text-customcolor;
}
</style>
