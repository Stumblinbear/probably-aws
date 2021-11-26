<template>
    <div class="w-full">
        <div class="center">
            <div class="box">
                <h2 class="text-2xl text-center">
                    <span class="font-semibold">Probably</span>
                    AWS...?
                </h2>

                <p class="my-6">
                    Try and figure out which of the given names are actual Amazon Web Service product names.
                </p>

                <p class="my-6">
                    Definitely the most fun game you'll ever play. We do not endorse playing it as a drinking game.
                </p>

                <button class="w-full button" @click="emit('state', 'PLAY')">Start Guessing</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    const emit = defineEmits([ 'state' ]);
</script>