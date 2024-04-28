<template>
  <div class="p-4">
    <div class="max-w-sm rounded overflow-hidden shadow-lg mb-4">
      <img
        class="w-full"
        src="https://tailwindcss.com/img/card-top.jpg"
        alt="Sunset in the mountains"
      />
      <div class="px-6 py-4 pb-2">
        <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
        <p class="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </p>
      </div>
      <div class="px-6 py-4">
        <span class="badge mr-2">#photography</span>
        <span class="badge mr-2">#travel</span>
        <span class="badge">#winter</span>
      </div>
    </div>

    <div>
      <FancyButton>Hello World!</FancyButton>
      <span class="text-sm font-semibold text-gray-700">Resolved tailwind config:</span>
      <textarea
        class="p-4 block text-sm border border-gray-100 rounded shadow w-full h-[32rem] font-mono outline-none"
        readonly
        :value="JSON.stringify(tailwindConfig, null, 2)"
      />
    </div>
  </div>
</template>

<script setup>
import tailwindConfig from '#tailwind-config/theme/colors';
</script>

<style lang="postcss" scoped>
.badge {
  @apply inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700;
  &:hover {
    @apply bg-gray-300;
  }
}
</style>
