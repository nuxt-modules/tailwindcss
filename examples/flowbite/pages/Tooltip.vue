<script setup>
import { onMounted } from 'vue'
import { Tooltip } from 'flowbite'
onMounted(() => {
   // set the tooltip content element
    const $targetEl = document.getElementById('tooltipContent');
    // set the element that trigger the tooltip using hover or click
    const $triggerEl = document.getElementById('tooltipButton');
    // options with default values
    const options = {
    placement: 'top',
    triggerType: 'hover',
    onHide: () => {
        console.log('tooltip is shown');
    },
    onShow: () => {
        console.log('tooltip is hidden');
    }
    };
    if ($targetEl) {
        /*
        * targetEl: required
        * triggerEl: required
        * options: optional
        */
        const tooltip = new Tooltip($targetEl, $triggerEl, options);
        // show the tooltip
        tooltip.show();
    }
})
</script>

<template>
  <div class="flex justify-center max-w-2xl p-4 mx-auto pt-26">
        <button id="tooltipButton" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Default tooltip</button>
        <div id="tooltipContent" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Tooltip content
            <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
    </div>
</template>