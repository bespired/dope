<template>
	<div class="flexcolumns">
		<button @click="load()"     class="blue">load</button>
		<button @click="save()"     class="blue">save</button>
		<button @click="download()" class="blue">download</button>
	</div>
</template>

<script>


export default {
	name: 'FileHandle',


	methods:
	{
		load() {
			this.$store.dispatch('file/loadDopeFile')
		},

		save() {
			this.$store.dispatch('file/saveDopeFile')
		},

		download() {
			this.$store.dispatch('file/downloadDopeFile')
		},
	},

}

</script>
