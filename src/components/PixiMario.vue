<template>
	<section id="pixi" ></section>
</template>

<script>
	import * as PIXI    from 'pixi.js'
	import { MarioApp } from '../modules/MarioApp.js'

	export default {
		name: 'PixiMario',

		mounted() {
			this.canvas   = document.getElementById('pixi')
			const domRect = this.canvas.getBoundingClientRect();

			PIXI.utils.skipHello();

			this.pix = new PIXI.Application({
					width:  domRect.width,
    				height: domRect.height,
    				backgroundAlpha: 0
					// backgroundColor: 'transparant'
				})

   			this.canvas.appendChild(this.pix.view)

   			this.app = new MarioApp(this.pix)
			this.app.start()
 		},

 		data() {
 			return {
				pix:    null,
				app:    null,
				canvas: null,
 			}
 		}

	}
</script>


<style>
#pixi {
	min-height: 290px
}
</style>