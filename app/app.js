
console.log('importing');
import Vue from 'vue';
import Tilt from './components/Tilt.vue';
import Board from './components/Board.vue';
import Paths from './components/Paths.vue';
import Path from './components/Path.vue';

console.log('adding components');
Vue.component('tilt', Tilt);
Vue.component('board', Board);
Vue.component('paths', Paths);
Vue.component('board-path', Path);

console.log('making vue');
const app = new Vue({
    el: '#tilt-maker'
});


console.log('running');
