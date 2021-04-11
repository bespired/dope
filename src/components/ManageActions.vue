<template>
	<div class="modal-overlay" v-if="actionsmanager">
		<div class="picklister">
			<template v-for="(frame, name) in actions">
				<div class="pickFrame" @click="select(name)" :class="{ selected:picklist.indexOf(name) > -1 }">
					<img :src="atlasImage" :style="clip(latest(frame))"  />
					<div class="label">{{ name }}</div>
				</div>
			</template>
		</div>
		<div class="action">
			<button @click="remove()" :disabled="!hasSelected" class="orange">remove</button>
			<button @click="newActionName= ''; newActionInput = true">new action</button>
			<div class="input-area" v-if="newActionInput">
				<input v-model="newActionName" placeholder="name new action" >
				<button @click="addNew()" >add</button>
				<button @click="newActionInput = false" class="grey">cancel</button>
			</div>
			<button class="toright" @click="actionsmanager = false">Done</button>
		</div>
	</div>
</template>

<script>

import clipFrame from '../mixins/clipframe.js';

export default {
	name: 'ManageActions',

	mounted() {
	},

	data() {
		return {
			newActionInput: false,
			newActionName : '',
			picklist      : [],
		}
	},

	computed:
	{
		actionsmanager: {
			get () { return this.$store.getters['dope/openActions'] },
			set () { this.$store.commit('dope/setManageAction', false) }
		},

		hasSelected() { return this.picklist.length > 0 },

		atlasSheet()  { return this.$store.getters['file/atlasSheet'] },
		atlasImage()  { return this.$store.getters['file/atlasImage'] },
		actions()     { return this.$store.getters['file/actions']    }

	},

	mixins: [
		clipFrame
	],

	methods:
	{
		// clip(frame){ in mixin },

		select(name) {
			let idx = this.picklist.indexOf(name)
			if (idx > -1){
				this.picklist.splice(idx,1)
			}else{
				this.$store.commit('dope/setAction', name)
				this.picklist.push(name)
			}
			this.picklist.sort()
		},

		addNew() {
			this.$store.dispatch('file/createNewAction', this.newActionName)
			this.newActionInput = false
		}


	}
}

</script>

<style scoped lang="scss">
	@import "../assets/sass/colors.scss";



	input {
		padding: 8px;
		width: 100%;
		min-width: 96px;
		border-radius: 4px;
		margin-right: 8px;
		border: 2px solid #16cfae;
	}

	.input-area{
		display: flex;
		background-color: rgba(240, 240, 240, 0.8);
		margin: -6px -6px -6px 0;
		padding: 6px;
		border-radius: 4px;
		position: absolute;
    	right: 18px;
    	left: 18px;
		button.grey{
			background-color: $bdgrey;
			margin-right: 0;
		}
	}

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
			width:100%;
			text-align: center;
			color: #333333;
		}

		img{
			user-select: none;
			position: absolute;
		}

		&:hover { background-color: $hover; cursor: pointer; }

		&.selected:after{
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