<template>
	<section @mousemove="mouseMove" @mouseup="mouseUp" @mouseleave="mouseUp" :class="{selectOff:scrollMove}">
		<div class="pageflex">
			<div class="cell pageflex">
				<DopeData/>
				<DopeDirection/>
			</div>
			<div class="cell"><PixiMario     /></div>
			<div class="cell">
				<FileHandle    />
				<SetFullscreen />
			</div>
			<div class="cell"><DopeTimeline  /></div>
			<div class="cell"><DopePicklist  /></div>
		</div>
	</section>
	<ManagePicklist />
	<ManageActions />
</template>
<script>

import PixiMario      from './components/PixiMario.vue'
import FileHandle     from './components/FileHandle.vue'
import SetFullscreen  from './components/SetFullscreen.vue'
import KeyCapture     from './components/KeyCapture.vue'
import DopeData       from './components/DopeData.vue'
import DopeTimeline   from './components/DopeTimeline.vue'
import DopePicklist   from './components/DopePicklist.vue'
import DopeDirection  from './components/DopeDirection.vue'

import ManagePicklist from './components/ManagePicklist.vue'
import ManageActions  from './components/ManageActions.vue'

export default {

	name: 'MarioApp',

	components: {
		DopeTimeline,
		DopeData,
		DopeDirection,
		DopePicklist,
		KeyCapture,
		PixiMario,
		FileHandle,
		SetFullscreen,

		ManagePicklist,
		ManageActions,
	},

	mounted() {
		window.addEventListener("keydown", event => {
			this.keypress(event)
			// event.preventDefault()
			// return false
		});
		window.addEventListener("keyup",   event => {
			this.keyrelease(event)
			// event.preventDefault()
			// return false
		});
	},

	destoyed() {
		window.removeEventListener("keydown", event => {
			this.keypress(event)
			event.preventDefault()
			return false
		});
		window.removeEventListener("keyup",   event => {
			this.keyrelease(event)
			event.preventDefault()
			return false
		});
	},

	computed:
	{
		scrollMove(){
			return this.$store.getters['mouse/getScrollMove']
		},
	},


	methods: {

		keypress(event) {
			// console.log('app down', event)
			this.$store.commit('keys/setKeyPress', event)
		},
		keyrelease(event) {
			// console.log('app up', event)
			this.$store.commit('keys/setKeyRelease', event)
		},

		mouseUp(event) {
			if (this.scrollMove) this.$store.commit('mouse/setScrollMove', false)
		},

		mouseMove(event) {
			if (this.scrollMove) {
				this.$store.commit('mouse/setScrollPosX', event.x)
				this.$store.commit('mouse/setScrollPosY', event.y)
			}
		},

	}

}
</script>
<style lang="scss">
@import "assets/sass/colors.scss";
@import "assets/sass/icons.scss";

#app {
	font-family: 'Noto Sans JP', sans-serif;
	position: absolute;
	display: block;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100vh;
}

#app > section {
	width: calc(100% - 40px);
	height: calc(100% - 40px);
	display: inline-block;
	padding: 20px;
}

.selectOff {
	user-select: none;
}

.cell {
	background-color: white;
	padding: 6px;
    border-radius: 4px;
    box-shadow: 0 0 20px 0px #7b7b7b1f;
    margin-bottom: 8px;
}

.pageflex{
	display: flex;
	flex-wrap: wrap;
}
.flexcolumns{
	display: flex;
	flex-direction: column;
	button { margin-bottom: 4px; }
}

.cell:nth-child(1) { width: calc(50% - 14px); margin-right: 8px;}
.cell:nth-child(2) { width: calc(33% - 15px); margin-right: 8px;}
.cell:nth-child(3) { width: 96px; }
.cell:nth-child(4) { width: 100%; }
.cell:nth-child(5) { width: 100%; }

.modal-overlay {
	position: absolute;
	top:    20px;
	left:   20px;
	bottom: 20px;
	right:  20px;
	box-shadow: 0 0 20px #61616182;
	background-color: white;

	border-radius: 4px;
	max-height: 100vh;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 1fr 75px;
	grid-column-gap: 0px;
	grid-row-gap: 0px;

}


button{
	background-color: $green;
	border: none;
	border-radius: 4px;
	color: white;
	padding: 10px 16px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	min-width: 96px;
	margin-right: 8px;

	&.orange {
		background-color: $orange;
	}
	&.blue {
		background-color: $blue;
	}
	&.toright {
		margin-left: auto
	}
	&[disabled] {
		opacity: 0.25;
	}

	&:hover {
		cursor: pointer;
		filter: brightness(1.1);
	}

}

</style>