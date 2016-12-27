

Vue.component('tilt', require('./components/Tilt.vue'));
Vue.component('board', require('./components/Board.vue'));
Vue.component('paths', require('./components/Paths.vue'));

const app = new Vue({
    el: '#tilt-maker'
});

