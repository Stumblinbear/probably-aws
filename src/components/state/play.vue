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
            <div class="box">
                <h3 class="mb-4 text-2xl font-semibold tracking-wider">
                    {{ selected == correct ? 'Correct!' : 'Wrong!' }}
                </h3>
                <div v-if="selected == correct">
                    they looked the same, to me
                </div>
                <div v-else-if="correct == 'NEITHER'">
                    neither of them were correct
                </div>
                <div v-else>
                    the correct one was <b>{{ correct == 'LEFT' ? left.option : right.option }}</b>
                    <div class="my-4" />
                    <a class="text-blue-600 hover:text-blue-300"
                        :href="'https://www.google.com/search?q=' + encodeURIComponent(correct == 'LEFT' ? left.option : right.option)"
                        target="_blank">
                        find out more
                    </a>
                </div>
            </div>

            <div class="my-4" />

            <div v-if="num.correct + num.wrong < COUNT_TO_ANSWER"
                    class="next" @click.stop="regen()">
                <h3 class="text-lg font-semibold tracking-wider">
                    {{ selected == correct ? 'keep going' : 'try again' }}
                </h3>
            </div>
            <div v-else
                    class="next" @click.stop="regen()">
                <h3 class="text-lg font-semibold tracking-wider">
                    {{ selected == correct ? 'i\'m finished' : 'i tried, i swear' }}
                </h3>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue';

    import awsnames from '/src/awsnames.js';
    import gloating from '/src/gloating.json';

    const COUNT_TO_ANSWER = 12;
    
    const emit = defineEmits([ 'state', 'correct', 'wrong' ]);

    let reals = Object.entries(awsnames.real).reduce((acc, [name, synonyms]) => {
        if(synonyms.length > 0) {
            acc.push(name);
        }

        return acc;
    }, []);

    let correct = ref(null);
    let selected = ref(null);

    let bases = [ 'AWS', 'Amazon' ];

    let fakes = [ ...Object.entries(awsnames.real).reduce((acc, [name, synonyms]) => {
        return [ ...acc, ...synonyms ];
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

    function getFake() {
        return (bases[Math.floor(Math.random() * bases.length)]) + ' ' + fakes[Math.floor(Math.random() * fakes.length)];
    }

    function regen() {
        if(num.correct + num.wrong == COUNT_TO_ANSWER) {
            emit('correct', num.correct);
            emit('wrong', num.wrong);
            emit('state', 'DONE');

            return;
        }

        selected.value = null;

        shuffle(colors, 'color');
        shuffle(gloating, 'flavor');

        let both = Math.random() < 0.25;

        let real = both ? getFake() : reals[Math.floor(Math.random() * reals.length)];
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
            num.correct += 1;
        }else{
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