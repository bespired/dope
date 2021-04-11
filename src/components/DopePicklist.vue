<template>
	<div class="picklist" v-if="fileLoaded">
		<div class="flexcolumns">
			<button @click="openPickManager()">Manage</button>
			<button @click="copyPickList()">In Use</button>
		</div>
		<div>
			<template v-for="frame in picklist">
				<div class="pickFrame" :class="{selected:frame === selectedCell }" @click="select(frame)">
					<img :src="atlasImage" :style="clip(frame)" />
					<div class="label">{{ frame }}</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>

import clipFrame from '../mixins/clipframe.js';

export default {
	name: 'DopePicklist',

	mounted() {
	},

	computed:
	{
		action()     { return this.$store.getters['dope/getAction']    },
		direction()  { return this.$store.getters['dope/getDirection'] },

		fileLoaded() { return this.$store.getters['file/fileLoaded']   },
		atlasSheet() { return this.$store.getters['file/atlasSheet']   },
		atlasImage() { return this.$store.getters['file/atlasImage']   },

		selectedCell:{
			get() {
				return this.$store.getters['dope/getSelectedCell']
			},
			set(value) {
				this.$store.commit('dope/selectedCell', value)
			}
		},

		picklist() { return this.$store.getters['file/picklist']([this.action, this.direction]) },

	},

	mixins: [
		clipFrame
	],

	methods:
	{
		// clip(frame){ in mixin },

		select(frame) {
			if ( frame === this.selectedCell ) { this.selectedCell = null; return }
			this.selectedCell = frame
		},

		openPickManager() {
			this.$store.commit('dope/setPickManager', true)
		},

		copyPickList() {
			this.$store.commit('file/inUsePicklist', { action: this.action, direction: this.direction })
		}


	}
}

</script>

<style scoped lang="scss">
	@import "../assets/sass/colors.scss";

	.picklist {
		overflow: scroll;
		white-space: nowrap;
		min-height: 132px;
		display: flex;
		& > div { margin: 2px; }
	}

	.pickFrame {
		transition: background-color 150ms linear;

		display: inline-block;
		position: relative;
		width: 64px;
		height: 95px;
		background-color: $bggrey;
		border-radius: 6px;
		margin: 0 2px 0 0;

		.label {
			position: absolute;
			bottom: -18px;
			font-size: 12px;
			width:100%;
			text-align: center;
			color: #333333;
		}

		img{
			user-select: none;
			position: absolute;
			overflow: hidden;
		}

		&:hover { background-color: $hover; cursor: pointer; }

		&.selected:after{
			content: "";
			border: 2px solid $blue;
			position: absolute;
			width: 62px;
			height: 93px;
			border-radius: 6px;
			transition: border-color 500ms linear;
		}
	}


</style>