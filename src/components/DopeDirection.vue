<template>

	<div class="keypad">

		<div class="pad icon icon-arrow-up" @click="direction ='north-west'" :class="{ selected : direction === 'north-west' }" />
		<div class="pad icon icon-arrow-up" @click="direction ='north'"      :class="{ selected : direction === 'north'      }" />
		<div class="pad icon icon-arrow-up" @click="direction ='north-east'" :class="{ selected : direction === 'north-east' }" />

		<div class="pad icon icon-arrow-up" @click="direction ='west'"       :class="{ selected : direction === 'west' }"       />
		<div class="pad" />
		<div class="pad icon icon-arrow-up" @click="direction ='east'"       :class="{ selected : direction === 'east' }"       />

		<div class="pad icon icon-arrow-up" @click="direction ='south-west'" :class="{ selected : direction === 'south-west' }" />
		<div class="pad icon icon-arrow-up" @click="direction ='south'"      :class="{ selected : direction === 'south'      }" />
		<div class="pad icon icon-arrow-up" @click="direction ='south-east'" :class="{ selected : direction === 'south-east' }" />

	</div>

</template>

<script>

export default {
	name: 'DopeDirection',

	computed:
	{
		direction:
		{
			get()      { return this.$store.getters['dope/getDirection'] },
			set(value) { this.$store.commit('dope/setDirection', value)  },
		}
	}

}

</script>

<style scoped lang="scss">
	@import "../assets/sass/colors.scss";

	.keypad {
	    display: flex;
		flex-flow: wrap;
		max-width: 96px;
		max-height: 96px;
		padding-top: 23px;

		.pad {
			min-width: 25px;
			min-height: 25px;
			margin-right: 4px;
			margin-bottom: 4px;
			border-radius: 4px;
			border: 1px solid $border;
			text-align: center;
			&:hover    { cursor: pointer; background-color: $green;}
			&:before   { display: inline-block;  }
			&.selected { background-color: $green; color: white; }
			&.selected:hover { filter: brightness(1.1); }
		}
		.pad:nth-child(1):before { transform: rotate(-45deg); }
		.pad:nth-child(3):before { transform: rotate( 45deg); }
		.pad:nth-child(4):before { transform: rotate(-90deg); }
		.pad:nth-child(6):before { transform: rotate( 90deg); }
		.pad:nth-child(7):before { transform: rotate(225deg); }
		.pad:nth-child(8):before { transform: rotate(180deg); }
		.pad:nth-child(9):before { transform: rotate(135deg); }

	}
</style>