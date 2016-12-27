<template>
	<div>
		<board v-if="startBoard !== null"
			:board="startBoard"
			>
		</board>

	    <div class="controls">
	      <button @click="reset">Reset</button>
	      <span v-if="done" class="badge">Done</span>
	      <template v-else>
		      <button v-if="running" @click="stop">Stop</button>
		      <button v-else @click="run">Run</button>
		      <button @click="step">Step</button>
		  </template>
	    </div>
	</div>
</template>

<script>
import Maker from '../Maker.js';
import BoardWalker from '../BoardWalker.js';
export default {
	data() {
		var board = Maker.generateRandomBoard();
		return {
			startBoard: board,
		    walker: new BoardWalker(board),
		    running: null,
		};
	},
	computed: {
		done() {
			return this.walker.active.length === 0;
		},
	},
	methods: {
		reset() {
			if (this.running) {
				this.stop();
			}
			this.startBoard = Maker.generateRandomBoard();
		    this.walker = new BoardWalker(this.startBoard);
		},
		step() {
			this.walker.step();
		},
		run() {
			this.running = setInterval(() => {
				this.step();
			}, 100);
		},
		stop() {
			clearInterval(this.running);
			this.running = null;
		}
	}
}
</script>

