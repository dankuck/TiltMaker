var gulp = require('gulp');

var elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir(function (mix) {
  mix.webpack('app.js');
});

