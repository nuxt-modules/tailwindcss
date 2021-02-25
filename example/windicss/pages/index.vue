<template>
<div>
  <div class="banner mt-5">
    <div
      class="px-4 py-2 bg-indigo-700 hover:(bg-blue-500 -translate-y-2) transform  transition-all cursor-pointer md:w-1/2 mx-auto rounded-full items-center text-indigo-100 leading-none lg:rounded-full flex"
      role="alert"
    >
        <span
          class="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3"
        >New</span>
      <span
        class="font-semibold mr-2 text-left flex-auto"
      >Get the coolest t-shirts from our brand new store</span>
      <svg
        class="fill-current opacity-75 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"
        />
      </svg>
    </div>
  </div>
  <pre>{{ tailwindConfig }}</pre>
</div>
</template>

<script>
import tailwindConfig from '~tailwind.config'

export default {
  data () {
    return { tailwindConfig }
  }
}
</script>
