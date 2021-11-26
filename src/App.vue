<template>
  <div class="bg-gray-800 h-screen text-gray-200">
    <state-start
      v-if="state == 'START'"
      @state="state = $event" />
    <state-play
      v-else-if="state == 'PLAY'"
      @correct="correct = $event"
      @wrong="wrong = $event"
      @state="state = $event" />
    <state-done
      v-else-if="state == 'DONE'"
      :correct="correct"
      :wrong="wrong"
      @state="state = $event" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  let state = ref('START');

  let correct = ref(0);
  let wrong = ref(0);
</script>

<style>
  .center {
    @apply grid place-items-center h-screen;
  }
  
  .box {
    @apply relative overflow-hidden
            w-full sm:w-96
            p-4
            text-gray-900
            bg-white rounded-xl
            shadow-lg;
  }

  .button {
    @apply p-2 pl-5 pr-5
      transition-colors duration-300 transform
      bg-indigo-500 hover:bg-blue-400
      text-gray-100 text-lg rounded-lg;
  }

  .button.outlined {
    @apply bg-transparent
            text-gray-800
            border-indigo-300
            border-4 hover:border-indigo-500;
  }
</style>
