<template>
  <div class="bg-gray-800 h-screen text-gray-200">
    <state-start
      v-if="state == 'START'"
      @state="setState" />
    <state-play
      v-else-if="state == 'PLAY'"
      @num="setNum"
      @state="setState" />
    <state-done
      v-else-if="state == 'DONE'"
      :num="num"
      @state="setState" />
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';

  let state = ref('START');

  let num = reactive({ correct: 0, wrong: 0 });
  
  gtag('event', 'page_view', { 'page_location': state.value });

  function setNum({ correct, wrong }) {
    num.correct = correct;
    num.wrong = wrong;

    gtag('event', 'result', { 'correct': correct, 'wrong': wrong, 'total': correct + wrong });
  }

  function setState(id) {
    state.value = id;

    gtag('event', 'page_view', { 'page_location': id.toLowerCase() });
  }
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
