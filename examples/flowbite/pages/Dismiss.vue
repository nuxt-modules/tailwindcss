<script setup>
import { onMounted } from 'vue'
import { Dismiss } from 'flowbite'
onMounted(() => {
   // target element that will be dismissed
    const $targetEl = document.getElementById('targetElement');
    // optional trigger element
    const $triggerEl = document.getElementById('triggerElement');
    // options object
    const options = {
    transition: 'transition-opacity',
    duration: 1000,
    timing: 'ease-out',
    // callback functions
    onHide: (context, targetEl) => {
        console.log('element has been dismissed')
        console.log(targetEl)
    }
    };
    if ($targetEl) {
        /*
        * targetEl: required
        * triggerEl: optional
        * options: optional
        */
        const dismiss = new Dismiss($targetEl, $triggerEl, options);
        // programatically hide it
        // dismiss.hide();
    }
})
</script>

<template>
  <div class="max-w-2xl p-4 mx-auto">
        <button id="triggerElement" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Hide alert</button>

        <div id="targetElement" class="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
        <span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
        </div>
    </div>
</template>