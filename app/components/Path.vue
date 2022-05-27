<template>
	<div>
		<div v-for="part in parts" class="path-part">
			<board v-if="part.type === 'board'" :board="part.board"></board>
			<div v-if="part.type === 'direction'" class="direction">
				{{ directionMap[part.direction] }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['path'],
	data() {
		return {
			directionMap: {
				'left': '◀',
				'right': '▶', 
				'up': '▲', 
				'down': '▼',
			},
		};
	},
	computed: {
		parts() {
			var parts = [];
			var board = this.path;
			while (board) {
				parts.unshift({type: 'board', board: board});
				if (board.lastDirection) {
					parts.unshift({type: 'direction', direction: board.lastDirection});
				}
				board = board.lastBoard;
			}
			return parts;
		}
	}
}
</script>

<style>
</style>
