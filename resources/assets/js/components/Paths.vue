<template>
<pre>
<template v-for="path in paths">
{{ path.toPathString() }}

</template>
</pre>
</template>

<script>
export default {
	props: ['paths'],
}
</script>
