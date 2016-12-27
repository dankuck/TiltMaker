<template>
	<div class="board">
		<div v-for="place in places" 
			class="place" 
			:style="{'left': (place.x) + 'em', 'top': (place.y) + 'em'}" 
			>
			□
		</div>
		<div v-for="piece in board.pieces" 
			:style="{'left': (piece.x) + 'em', 'top': (piece.y) + 'em', 'color': colorMap[piece.symbol]}" 
			class="piece"
			>
			{{ symbolMap[piece.symbol] }}
		</div>
	</div>
</template>

<script>
import Piece from '../Piece.js';
export default {
	props: ['board'],
	data() {
		var symbolMap = {};
		symbolMap[Piece.GREEN] = "●";
		symbolMap[Piece.BLUE] = "●";
		symbolMap[Piece.BLOCK] = "■";
		symbolMap[Piece.HOLE] = "○";
		var colorMap = {};
		colorMap[Piece.GREEN] = "green";
		colorMap[Piece.BLUE] = "blue";
		colorMap[Piece.BLOCK] = "#888";
		colorMap[Piece.HOLE] = "black";
		return {
			symbolMap: symbolMap,
			colorMap: colorMap,
		};
	},
	computed: {
		places() {
			var places = [];
			for (var x = 0; x < 5; x++) {
				for (var y = 0; y < 5; y++) {
					places.push({x, y});
				}
			}
			return places;
		},
	},
}
</script>

<style>
.board {
	position: relative;
	width: 5em;
	height: 5em;
	border: 1px solid #CCC;
	border-radius: .5em;
}

	.board .piece {
		position: absolute;
	}

	.board .place {
		position: absolute;
		color: #DDD;
	}
</style>
