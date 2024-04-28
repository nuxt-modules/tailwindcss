<template>
  <div class="p-4">
    <UCard>
      <template #header>
        <img
          class="w-full rounded"
          src="https://tailwindcss.com/img/card-top.jpg"
          alt="Sunset in the mountains"
        />
      </template>
      <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
      <p class="text-gray-700 dark:text-gray-300">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
        quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
        nihil.
      </p>
      <template #footer>
        <div class="flex gap-2">
          <UBadge>#photography</UBadge>
          <UBadge>#travel</UBadge>
          <UBadge>#winter</UBadge>
        </div>
      </template>
    </UCard>
  </div>
</template>
