<template>
	<section>
		<button @click="increment()">count is: {{ count }}</button>
		<MarioTimeline />
		<p>{{ getCount }}</p>
	</section>
</template>

<script>

import MarioTimeline from './MarioTimeline.vue'

export default {
	name: 'GuiOverlay',

	props: {
		msg: String
	},

	// components: ['MarioTimeline'],

	data() {
		return {
			count: 0
		}
	},

	computed: {
		mainStore() {
			return this.$store.getters['main/getMainStore']
		},
		getCount() {
			return this.$store.getters['main/getCount']
		}
	},

	methods: {
		increment() {
			this.count++
			this.$store.commit('main/setCount', this.count)
		}
	}

}

</script>

<style scoped>
a {
	color: #42b983;
}
</style>