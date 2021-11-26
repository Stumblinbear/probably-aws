<template>
    <div class="w-full h-2 bg-blue-200 rounded-full">
        <div
            class="h-full text-center text-xs text-white bg-blue-600 rounded-full transition-all duration-300"
            :style="{ width: (Math.max(0, Math.min(1, props.value)) * 100) + '%' }">

        </div>
    </div>
</template>

<script setup>
    let props = defineProps({
        value: {
            type: Number,
            default: 0
        }
    });
</script>