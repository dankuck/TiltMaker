import Vue from 'vue';
import Tilt from './components/Tilt.vue';
import Board from './components/Board.vue';
import Paths from './components/Paths.vue';
import Path from './components/Path.vue';

Vue.component('tilt', Tilt);
Vue.component('board', Board);
Vue.component('paths', Paths);
Vue.component('board-path', Path);

const app = new Vue({
    el: '#tilt-maker'
});
