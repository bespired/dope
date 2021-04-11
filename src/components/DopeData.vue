<template>
	<table class="mySpace" v-if="fileLoaded">
		<tr>
			<td>Sheet</td>
			<td>:</td>
			<td>{{ atlasName }}</td>
			<td><button class="grey">change</button> </td>
		</tr>
		<tr>
			<td>Action</td>
			<td>:</td>
			<td>
				<MarioSelect :options="actions" store="action" />
			</td>
			<td><button @click="manageAction()">Manage</button> </td>
		</tr>
		<tr>
			<td>Direction</td>
			<td>:</td>
			<td>
				<MarioSelect :options="directions" store="direction" />
			</td>
			<td><button @click="nextDirection()">Next</button></td>
		</tr>
		<tr>
			<td>Speed</td>
			<td>:</td>
			<td>
				<MarioSelect :options="speeds" store="speed" />
			</td>
			<td></td>
		</tr>
		<tr>
			<td>Move</td>
			<td>:</td>
			<td>
				<input v-model="speed.x" type="number" @change="syncY()"/>
				<input v-model="speed.y" type="number" @change="syncX()" />
			</td>
			<td><button @click="defaultSpeed()">Default</button></td>
		</tr>
		<tr>
			<td>Frames</td>
			<td>:</td>
			<td>{{ frames.length }}</td>
			<td></td>
		</tr>
	</table>
</template>

<script>

import MarioSelect from './MarioSelect.vue'

export default {
	name: 'DopeData',

	components: { MarioSelect },

	data() {
		return {
			speeds:     [60, 50, 30, 25, 20, 15, 14, 10, 8, 7, 6, 5, 4],
			defaultSpeeds: {
				"north" :       { x:  0, y: -1 }, "north-east" :  { x:  1, y: -1 },
				"east" :        { x:  1, y:  0 }, "south-east" :  { x:  1, y:  1 },
				"south" :       { x:  0, y:  1 }, "south-west" :  { x: -1, y:  1 },
				"west" :        { x: -1, y:  0 }, "north-west" :  { x: -1, y: -1 },
			}
		}
	},

	computed:
	{
		fileLoaded() { return this.$store.getters['file/fileLoaded']   },
		atlasName()  { return this.$store.getters['file/atlasName']    },
		atlasSheet() { return this.$store.getters['file/atlasSheet']   },
		atlasImage() { return this.$store.getters['file/atlasImage']   },

		actions()    { return this.$store.getters['file/actionNames']  },
		directions() { return this.$store.getters['file/directions']   },

		sheet()      { return this.$store.getters['dope/getName']      },
		action()     { return this.$store.getters['dope/getAction']    },
		direction()  { return this.$store.getters['dope/getDirection'] },

		speed()      { return this.$store.getters['file/speed']([this.action, this.direction]) },
		frames()     { return this.$store.getters['file/frames']([this.action, this.direction]) },
		fps()        { return this.$store.getters['file/fps']([this.action, this.direction]   ) },

	},

	methods:
	{
		manageAction() {
			this.$store.commit('dope/setManageAction', true)
		},
		nextDirection() {
			var index = this.directions.findIndex(obj => obj === this.direction)
			let next = ( index + 1 ) % this.directions.length
			this.$store.commit('dope/setDirection', this.directions[next])
		},
		defaultSpeed() {
			let speed = 0
			speed = this.defaultSpeeds[this.direction].x * 128
			this.$store.commit('file/setSpeedX', {action: this.action, direction: this.direction, speed: speed })

			speed = this.defaultSpeeds[this.direction].y * 44
			this.$store.commit('file/setSpeedY', {action: this.action, direction: this.direction, speed: speed })
		},
		syncY() {
			let speed = Math.abs(this.speed.x / 2) * Math.sign(this.speed.y)
			this.$store.commit('file/setSpeedY', {action: this.action, direction: this.direction, speed: speed })
		},
		syncX() {
			let speed = Math.abs(this.speed.y * 2) * Math.sign(this.speed.x)
			this.$store.commit('file/setSpeedX', {action: this.action, direction: this.direction, speed: speed })
		}
	},

}

</script>

<style scoped lang="scss">
	@import "../assets/sass/colors.scss";

	button.grey{
		background-color: $bdgrey
	}

	select {
		padding: 8px;
    	width: 100%;
    	min-width: 96px;
    	border: 1px solid $bdgrey;
    	border-radius: 4px;
    }
    input{
		padding: 8px 4px;
		min-width: 45px;
    	max-width: 45px;
    	border-radius: 4px;
    	border: 1px solid $bdgrey;
    	&:first-of-type { margin-right: 8px; }
    }


</style>

