<template>
<div>
	<div v-if="paths.length > 0">
		<div v-for="path in paths">
			<board-path :path="path"></board-path>
		</div>
	</div>
	<div v-else>
		{{ noneMessage || 'No paths.' }}
	</div>
</div>
</template>

<script>
export default {
	props: ['paths', 'noneMessage'],
}
</script>
