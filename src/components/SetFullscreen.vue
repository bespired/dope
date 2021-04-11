<template>
	<div class="at-end"><i class="icon icon-fullscreen"
		:key="`on-${update}`"   @click="fullscreen(true)"  v-if="!isFullscreen" /></div>
	<div class="at-end"><i class="icon icon-smaller"
		:key="`off-${update}`"  @click="fullscreen(false)" v-if="isFullscreen"  /></div>
</template>

<script>

export default {
	name: 'SetFullscreen',

	mounted() {
		["", "webkit", "moz", "ms"].forEach(
		    prefix => document.addEventListener(prefix+"fullscreenchange", this.getFullscreenMode, false)
		);
	},

	unmounted() {
		["", "webkit", "moz", "ms"].forEach(
  		  prefix => document.addEventListener(prefix+"fullscreenchange", this.getFullscreenMode, false)
		);
	},

	data() {
		return {
			update: 0,
			isFullscreen : false,
		}
	},

	methods: {
		getFullscreenMode() {
			this.isFullscreen= false
			if (!document) return

			this.isFullscreen=  document.fullscreenElement !== null
		},

		fullscreen(onoff) {
			const elem = document.documentElement;

			if ( onoff ){
				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				} else if (elem.webkitRequestFullscreen) { /* Safari */
					elem.webkitRequestFullscreen();
				} else if (elem.msRequestFullscreen) { /* IE11 */
					elem.msRequestFullscreen();
				}
			}else{
				document.exitFullscreen();
			}
		}
	}

}

</script>

<style scoped lang="scss">
	@import "../assets/sass/colors.scss";

	.icon{
		padding: 5px;
		max-width: 25px;
		max-height: 25px;
		display: inline-flex;
		border-radius: 3px;
		&:hover{
			cursor: pointer;
			background-color: $blue;
			color: $light;
		}
	}
	.at-end {
		position: absolute;
    	top: 25px;
    	right: 25px;
    }
</style>