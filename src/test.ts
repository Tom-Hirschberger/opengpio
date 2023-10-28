import binding from 'bindings';
const bindings: {
    init: () => void;
} = binding('opengpio');

setInterval(() => {}, 1000);

bindings.init();
console.log('init');
// import { devices } from './main';
// import { Edge } from './types';

// const { NanoPi_NEO3 } = devices;

// NanoPi_NEO3.get(27);
// NanoPi_NEO3.set(27, true);
// const watchWorker = NanoPi_NEO3.watch(27, Edge.Rising, (value) => {});
// const pwmWorker = NanoPi_NEO3.pwm(27, 0.5, 50);

// setTimeout(() => {
//     watchWorker.kill();
//     pwmWorker.kill();
// }, 3000);
