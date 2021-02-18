<template>
  <main>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 test">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div class="max-w-md mx-auto">
            <Nuxt />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
