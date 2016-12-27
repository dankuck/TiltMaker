<template>
<div>
<pre v-if="paths.length > 0"><template v-for="path in paths">
{{ path.toPathString() }}
</template></pre>
<pre v-else>
{{ noneMessage || 'No paths.' }}
</pre>
</div>
</template>

<script>
export default {
	props: ['paths', 'noneMessage'],
}
</script>
