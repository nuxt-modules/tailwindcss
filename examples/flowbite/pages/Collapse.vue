<script setup>
import { onMounted } from 'vue'
import { Collapse } from 'flowbite'
onMounted(() => {
    // set the target element that will be collapsed or expanded (eg. navbar menu)
    const $targetEl = document.getElementById('targetEl');
    // optionally set a trigger element (eg. a button, hamburger icon)
    const $triggerEl = document.getElementById('triggerEl');
    // optional options with default values and callback functions
    const options = {
    onCollapse: () => {
        console.log('element has been collapsed')
    },
    onExpand: () => {
        console.log('element has been expanded')
    },
    onToggle: () => {
        console.log('element has been toggled')
    }
    };
    if ($targetEl) {
        /*
        * targetEl: required
        * options: optional
        */
        const collapse = new Collapse($targetEl, $triggerEl, options);
        // show the target element
        collapse.expand();
    }
})
</script>

<template>
  <div class="max-w-2xl p-4 mx-auto">
        <!-- Trigger element -->
        <button id="triggerEl" aria-expanded="false" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Trigger collapse</button>

        <!-- Target element -->
        <div id="targetEl" class="hidden">
        <ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">Profile</li>
            <li class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Settings</li>
            <li class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Messages</li>
            <li class="w-full px-4 py-2 rounded-b-lg">Download</li>
        </ul>
        </div>
</div>
</template>