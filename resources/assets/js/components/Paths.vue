<template>
<div>
	<div v-if="pageCount > 1">
        <div class="tabs">
            <div v-for="page in pages" class="tab" :class="tabClass(page)" @click="showPage(page)">
            	{{ page }}
            </div>
        </div>
	</div>
	<div v-if="paths.length > 0">
		<div v-for="path in pagedPaths">
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
	data() {
		return {
			page: 1,
			pageLength: 10,
		};
	},
	computed: {
		pagedPaths() {
			return this.paths.slice((this.page - 1) * this.pageLength, this.page * this.pageLength);
		},
		pageCount() {
			return Math.ceil(this.paths.length / this.pageLength);
		},
		pages() {
			var pages = [];
			for (var i = 1; i <= this.pageCount; i++) {
				pages.push(i);
			}
			return pages;
		},
	},
	methods: {
        showPage(page) {
            this.page = page;
        },
        tabClass(page) {
            if (page === this.page) {
                return "active";
            }
            return "";
        },
    },
}
</script>
