<template>
    <div class="flex flex-col h-screen" @click="!selected ? null : null">
        <div class="flex flex-col md:flex-row h-full">
            <paws-option v-if="!selected"
                class="bg-opacity-40 hover:bg-opacity-80"
                :class="left.color"
                :flavor="left.flavor"
                @click.stop="select('LEFT')">
                {{ left.option }}
            </paws-option>
            <paws-option v-else
                :class="left.color + ' ' + (correct == 'LEFT' ? 'bg-opacity-100' : 'bg-opacity-10 text-gray-400')"
                :flavor="left.flavor">
                {{ left.option }}
            </paws-option>

            <div class="h-1 md:h-full md:w-1 bg-white" />

            <paws-option v-if="!selected"
                class="bg-opacity-40 hover:bg-opacity-80"
                :class="right.color"
                :flavor="right.flavor"
                @click.stop="select('RIGHT')">
                {{ right.option }}
            </paws-option>
            <paws-option v-else
                :class="right.color + ' ' + (correct == 'RIGHT' ? 'bg-opacity-100' : 'bg-opacity-10 text-gray-400')"
                :flavor="right.flavor">
                {{ right.option }}
            </paws-option>
        </div>
        <paws-progress :value="(num.correct + num.wrong) / COUNT_TO_ANSWER"></paws-progress>
    </div>

    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="mx-auto rounded-lg bg-gray-800 cursor-pointer">
            <div v-if="!selected"
                    class="neither hover:bg-opacity-100"
                    @click.stop="!selected ? select('NEITHER') : null">
                Neither
            </div>
            <div v-else
                    class="neither" :class="correct == 'NEITHER' ? 'bg-opacity-80' : 'bg-opacity-10'">
                Neither
            </div>
        </div>
    </div>

    <div v-if="!!selected" class="absolute top-0 right-0 bottom-0 left-0 bg-gray-900 opacity-50" />

    <div v-if="selected"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="text-center">
            <div class="grid gap-4 box">
                <h2 class="text-2xl font-bold tracking-wider">
                    {{ selected == correct ? 'Correct!' : 'Wrong!' }}
                </h2>
                
                <div v-if="correct == 'NEITHER'">
                    neither of them were correct
                </div>
                <div v-else>
                    <div class="grid gap-3 p-4 bg-gray-100 rounded-lg">
                        <h3 class="text-xl font-semibold">{{ correct == 'LEFT' ? left.option : right.option }}</h3>

                        <p class="text-sm">According to Amazon (not us):</p>

                        <div class="p-4 bg-gray-200 rounded-lg">
                            <p class="text-sm">{{ awsnames.real[correct == 'LEFT' ? left.option : right.option].desc || 'no description yet' }}</p>
                        </div>

                        <a class="text-blue-600 hover:text-blue-300 text-xs"
                            :href="'https://www.google.com/search?q=' + encodeURIComponent(correct == 'LEFT' ? left.option : right.option)"
                            target="_blank">
                            find out more (but why would you want to?)
                        </a>
                    </div>
                </div>

                <div v-if="num.correct + num.wrong < COUNT_TO_ANSWER"
                        class="next" @click.stop="regen()">
                    <h3 class="text-sm font-semibold text-white tracking-wider">
                        {{ correct == 'NEITHER' ? 'try again' : exasperation[Math.floor(Math.random() * exasperation.length)] }}
                    </h3>
                </div>
                <div v-else
                        class="next" @click.stop="regen()">
                    <h3 class="text-md font-semibold text-white tracking-wider">
                        {{ selected == correct ? 'i\'m finished' : 'i tried, i swear' }}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue';

    import awsnames from '/src/awsnames.js';
    import { egging, exasperation } from '/src/gloating.json';

    const COUNT_TO_ANSWER = 12;
    
    const emit = defineEmits([ 'state', 'correct', 'wrong' ]);

    let reals = Object.entries(awsnames.real).reduce((acc, [name, { fakes }]) => {
        if(fakes.length > 0) {
            acc.push(name);
        }

        return acc;
    }, []);

    let visited = reactive([ ]);
    let correct = ref(null);
    let selected = ref(null);

    let bases = [ 'AWS', 'Amazon' ];

    let fakes = [ ...Object.entries(awsnames.real).reduce((acc, [name, { fakes }]) => {
        return [ ...acc, ...fakes ];
    }, []), ...awsnames.fakes];

    let colors = [
        'bg-red-800',
        'bg-yellow-800',
        'bg-green-800',
        'bg-blue-800',
        'bg-indigo-800',
        'bg-purple-800',
        'bg-pink-800',
    ];

    let left = reactive({
        color: 'bg-gray-800 hover:bg-gray-700',
        option: null,
        flavor: null
    });

    let right = reactive({
        color: 'bg-gray-800 hover:bg-gray-700',
        option: null,
        flavor: null
    });

    let num = reactive({ correct: 0, wrong: 0 });

    function shuffle(arr, id) {
        left[id] = arr[Math.floor(Math.random() * arr.length)];

        while(true) {
            right[id] = arr[Math.floor(Math.random() * arr.length)];

            if(left[id] != right[id]) {
                break;
            }
        }
    }

    function getReal() {
        while(true) {
            let real = reals[Math.floor(Math.random() * reals.length)];

            if(!visited.includes(real)) {
                visited.push(real);
                return real;
            }else{
                console.log('skipping already visited:', real);
            }
        }
    }

    function getFake() {
        return (bases[Math.floor(Math.random() * bases.length)]) + ' ' + fakes[Math.floor(Math.random() * fakes.length)];
    }

    function regen() {
        if(num.correct + num.wrong == COUNT_TO_ANSWER) {
            emit('num', num);
            emit('state', 'DONE');

            return;
        }

        selected.value = null;

        shuffle(colors, 'color');
        shuffle(egging, 'flavor');

        let both = Math.random() < 0.25;

        let real = both ? getFake() : getReal();
        let fake = getFake();

        if(Math.random() < 0.5) {
            correct.value = 'LEFT';

            left.option = real;
            right.option = fake;
        }else{
            correct.value = 'RIGHT';
            
            right.option = real;
            left.option = fake;
        }
        
        if(both) {
            correct.value = 'NEITHER';
        }
    }

    regen();

    function select(id) {
        selected.value = id;

        if(id == correct.value) {
            gtag('event', 'choice', { 'value': 'CORRECT' });

            num.correct += 1;
        }else{
            gtag('event', 'choice', { 'value': 'WRONG' });

            num.wrong += 1;
        }
    }
</script>

<style scoped>
    .neither {
        @apply py-4 px-8
            text-lg
            bg-red-700 bg-opacity-60
            border-2 border-white
            rounded-lg
            duration-150 transition-all
            select-none;
    }

    .next {
        @apply py-4 px-8
            text-lg
            bg-gray-800 hover:bg-gray-700
            border-2 border-white
            rounded-lg
            duration-150 transition-colors
            select-none
            cursor-pointer;
    }
</style>