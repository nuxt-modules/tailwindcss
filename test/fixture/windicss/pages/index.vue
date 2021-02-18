<template>
  <div>
    <div>
      <Logo />
    </div>
    <div class="divide-y divide-gray-300">
      <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
        <h1 class="text-3xl" data-testid="hello">
          Hello Windi CSS
        </h1>
        <p>An advanced online playground for Tailwind CSS, including support for things like:</p>
        <ul class="list-disc space-y-2">
          <Feature>
            Customizing your
            <code class="text-sm font-bold text-gray-900">tailwind.config.js</code> file
          </Feature>
          <Feature>
            Extracting classes with
            <code class="text-sm font-bold text-gray-900">@apply</code>
          </Feature>
          <Feature>
            Code completion with instant preview
          </Feature>
        </ul>
        <p>Perfect for learning how the framework works, prototyping a new idea, or creating a demo to share online.</p>
      </div>
      <div class="testApply" data-testid="apply">
        <nuxt-link to="/typography" class="mt-3 font-bold text-cyan-600 hover:text-cyan-700">
          Typography &rarr;
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.testApply {
  @apply pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7;
}

@screen +sm {
  ul {
    @apply bg-gray-100 p-2 rounded-lg;
  }
}
</style>
