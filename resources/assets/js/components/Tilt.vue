<template>
	<div>
		<board v-if="startBoard !== null"
			:board="startBoard"
			>
		</board>
	</div>
</template>

<script>
import Maker from '../Maker.js';
export default {
	data() {
		return {
			startBoard: Maker.generateRandomBoard()
		};
	}
}
</script>

