<template>

	<div class="keypad">

		<div class="pad icon icon-arrow-up" />
		<div class="pad icon icon-arrow-up" />
		<div class="pad icon icon-arrow-up" />

		<div class="pad icon icon-arrow-up" />
		<div class="pad" />
		<div class="pad icon icon-arrow-up" />

		<div class="pad icon icon-arrow-up" />
		<div class="pad icon icon-arrow-up" />
		<div class="pad icon icon-arrow-up" />

	</div>

	<div>{{ pressed }}</div>

</template>

<script>

export default {
	name: 'KeyCapture',

	mounted() {
	},

	computed:
	{
		pressed() {
			return this.$store.getters['keys/pressed']
		},

	},

	methods:
	{
	}
}

</script>

<style scoped lang="scss">
	@import "../assets/sass/colors.scss";

	.keypad {
	    display: flex;
		flex-flow: wrap;
		max-width: 96px;
		.pad {
			min-width: 25px;
			min-height: 25px;
			margin-right: 4px;
			margin-bottom: 4px;
			border-radius: 4px;
			border: 1px solid $border;
			text-align: center;
			&:before{ display: inline-block;  }
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