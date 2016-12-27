<template>
<pre>
<template v-for="path in paths">
{{ path.toPathString() }}
</template>
<div v-if="paths.length === 0">
No paths.
</div>
</pre>
</template>

<script>
export default {
	props: ['paths'],
}
</script>
