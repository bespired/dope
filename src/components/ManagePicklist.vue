<template>
	<div class="modal-overlay" v-if="pickmanager">
		<div class="picklister" v-if="fileLoaded">
			<template v-for="(frame, name) in sortedSheet">
				<div class="pickFrame" @click="select(name)" :class="{ selected:picklist.indexOf(name) > -1 }">
					<img :src="atlasImage" :style="clip(frame)" />
					<div class="label">{{ name }}</div>
				</div>
			</template>
		</div>
		<div class="action">
			<button @click="nextDirection()">Next Direction</button>
			<button class="toright" @click="pickmanager = false">Done</button>
		</div>
	</div>
</template>

<script>

import clipFrame from '../mixins/clipframe.js';

export default {
	name: 'ManagePicklist',

	mounted() {
	},

	computed:
	{
		action()      { return this.$store.getters['dope/getAction']       },
		direction()   { return this.$store.getters['dope/getDirection']    },

		fileLoaded()  { return this.$store.getters['file/fileLoaded']      },
		atlasSheet()  { return this.$store.getters['file/atlasSheet']      },
		atlasImage()  { return this.$store.getters['file/atlasImage']      },

		sortedSheet() {
			return Object.keys(this.atlasSheet).sort().reduce(
				(obj, key) => {
					obj[key] = this.atlasSheet[key];
					return obj;
				}, {}
			);
		},

		picklist: {
			get() { return this.$store.getters['file/picklist']([this.action, this.direction]) },
			set(value) {
				const payload = { picklist: value, action: this.action, direction: this.direction }
				this.$store.commit('file/setPicklist', payload);
			}
		},

		pickmanager: {
			get () { return this.$store.getters['dope/openPickManager'] },
			set () { this.$store.commit('dope/setPickManager', false)   }
		},

	},

	mixins: [
		clipFrame
	],

	methods:
	{

		// clip(frame){ in mixin },

		nextDirection() {
			const cells = Object.keys(this.atlasSheet).length
			const skip  = Math.floor( cells / 8 )

			let list= []
			const regex = /([^0-9]*)([0-9]*)/gm;
			this.picklist.forEach( p => {

				const regex = /([^0-9]*)([0-9]*)/gm;
				const m = regex.exec(p)
				const name   = m[1]
				const number = ( parseInt(m[2], 10) + skip ) % cells
				const padded = `0000${number}`.substr(-4)

				list.push(`${name}${padded}`)

			})

			this.picklist = JSON.parse(JSON.stringify(list))

		},

		select(name) {
			let idx = this.picklist.indexOf(name)
			if (idx > -1){ this.picklist.splice(idx,1) }else{ this.picklist.push(name) }
			this.picklist.sort()
		}


	}
}

</script>
<style scoped lang="scss">
	@import "../assets/sass/colors.scss";

	.picklister {
		grid-area: 1 / 1 / 2 / 2;
		overflow: scroll;
		padding: 20px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;

		&:after {
			content: "";
			flex: auto;
		}

	}

	.action {
		grid-area: 2 / 1 / 3 / 2;
		padding: 20px;
		display: flex;
	}

	.pickFrame {
		transition: background-color 150ms linear;

		display: inline-block;
		position: relative;
		width: 64px;
		height: 95px;
		background-color: $bggrey;
		border-radius: 6px;
		margin: 0 2px 2px 0;
		overflow: hidden;

		.label {
			position: absolute;
			bottom: 2px;
			font-size: 12px;
			width: 100%;
			text-align: center;
			color: #333333;
		}

		img {
			user-select: none;
			position: absolute;
		}

		&:hover {
			background-color: $hover;
			cursor: pointer;
		}

		&.selected:after {
			content: "";
			border: 2px solid $blue;
			position: absolute;
			width: 60px;
			height: 90px;
			border-radius: 6px;
			transition: border-color 500ms linear;
		}
	}
</style>