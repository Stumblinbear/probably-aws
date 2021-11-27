<template>
    <div class="option select-none"
            @mouseover="hovering = true"
            @mouseleave="hovering = false">
        <div class="w-96 text-center">
            <h2 class="text-3xl font-light tracking-wider">
                <slot />
            </h2>
            <div
                    class="mt-4 font-thin tracking-widest transition-opacity duration-300"
                    :class="hovering ? 'opacity-100' : 'opacity-70 md:opacity-0'">
                {{ props.flavor }}
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    let props = defineProps({
        flavor: String
    });

    let hovering = ref(false);
</script>

<style scoped>
    .option {
        @apply flex flex-col items-center justify-center
            w-full h-full md:h-full
            duration-150 transition-all
            cursor-pointer;
    }
</style>