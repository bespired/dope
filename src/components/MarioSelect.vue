<template>
	<select v-model="model">
		<template v-for="option in options">
			<option :value="option">{{ option }}</option>
		</template>
	</select>
</template>

<script>

export default {
	name: 'MarioSelect',

	props: {
		options: Array,
		store: String
	},

	data() {
		return {
			getters: {
				action    : 'dope/getAction',
				direction : 'dope/getDirection',
			},
			setters: {
				action    : 'dope/setAction',
				direction : 'dope/setDirection',
			},
		}
	},

	computed:
	{
		action()     { return this.$store.getters['dope/getAction']    },
		direction()  { return this.$store.getters['dope/getDirection'] },

		model:{
			get() {
				if ( this.store === 'speed' ){
					return this.$store.getters['file/fps']([this.action, this.direction])
				}
				return this.$store.getters[this.getters[this.store]]
			},
			set(value) {
				this.$store.commit('dope/selectedCell', null)

				if ( this.store === 'speed' ){
					this.$store.commit('file/setFps', { action:this.action, direction: this.direction, fps: value })
					return
				}
				this.$store.commit(this.setters[this.store], value)
			}
		},
	}
}

</script>