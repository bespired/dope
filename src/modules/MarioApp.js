import * as PIXI from 'pixi.js'
import store from '../store'

export class MarioApp{

	constructor(gfx) {

		this.gfx     = gfx
		this.loader  = new PIXI.Loader

		this.now     = new Date().getTime()
		this.prev    = new Date().getTime()

		this.text    = null
		this.sprites = {}
		this.action    = 'idle'
		this.direction = 'south'
		this.fps       = 1
		this.dopesheet = null


		store.watch( () => store.getters['dope/getAction'],    (newValue, oldValue) => {
			this.action    = newValue
		})
		store.watch( () => store.getters['dope/getDirection'], (newValue, oldValue) => {
			this.direction = newValue
		} )
		store.watch( () => store.getters['file/dopeSheet'],    (newValue, oldValue) => {
			this.dopesheet = newValue;
		})

		this.ticker   = new PIXI.Ticker();

		this.ticker.add(() => {
			this.render();
		}, PIXI.UPDATE_PRIORITY.LOW);

		PIXI.utils.clearTextureCache

	}

	doThing(value) {
		console.log(value)
	}

	start() {
		this.loader
			.add('firemario',  './atlasmaps/firemario.json')
			.add('castle',     './atlasmaps/castle.json')
			.add('floortile',  './images/floor-stone.png')
			.add('marioshade', './images/shade.png')
			.load();

		this.loader.onComplete.add(() => { this.setup() });
	}

	setup() {

		// Floor
		const floor = new PIXI.Container();
		let castle = this.loader.resources["castle"];



		for (let y=0; y<12; y++){
			for (let x=0; x<5; x++){

				let name = Math.random() < .5 ? 'floor-stone' : 'floor-shear'
				if ( Math.random() > .7  ) name = 'floor-sand'

				let floortile = new PIXI.Sprite(castle.textures[name]);
				floortile.anchor.set(0.5, 0.5)
				floortile.x = x * 128 + ( y % 2 ) * 64
				floortile.y = y * 22
				floor.addChild(floortile)
			}
		}
		floor.pivot.x = 128
		floor.pivot.y = 64
		floor.x = 75
		floor.y = 100

		this.sprites.floor = floor

		let marioshade = PIXI.Texture.from('marioshade')
		let shade = new PIXI.Sprite(marioshade);
		shade.anchor.set(0.5, -0.5);
		shade.x = 75
		shade.y = 100
		shade.scale.x = 0.8;
		shade.scale.y = 0.8;
		this.sprites.shade = shade


		// Mario

		let sheet = this.loader.resources["firemario"];
		let mario = new PIXI.Sprite(sheet.textures["fire0001"]);

		mario.x = 75
		mario.y = 10
		mario.anchor.set(0.5, 0.0);

		mario.frame = 1

		this.sprites.mario = mario

		this.gfx.stage.addChild(floor);
		this.gfx.stage.addChild(shade);
		this.gfx.stage.addChild(mario);

		var rect = new PIXI.Graphics();
		rect.lineStyle(1, 0xD82257, 1);

		rect.x = mario.x - 64
		rect.y = mario.y
		rect.drawRect(0, 0, 128, 190);

		this.gfx.stage.addChild(rect);

		this.text = new PIXI.Text('0',
			{fontFamily : 'Arial', fontSize: 16, fill : 0x000000, align : 'center'});

		this.text.x= 20
		this.text.y= 210

		this.gfx.stage.addChild(this.text);

		this.ticker.start();

	}

	render(){

		let local = ( new Date().getTime() - this.now  ) / 1000
		let spent = ( new Date().getTime() - this.prev ) / 1000

		this.prev = new Date().getTime()

		if ( this.dopesheet !== null ){
			this.fps = this.dopesheet.actions[this.action].directions[this.direction].fps
			this.text.text = this.fps + ' ' + this.action + ' ' + this.direction + ' ' + local + ' ' + spent
		}

		const mario = this.sprites.mario
		const frames     = this.dopesheet.actions[this.action].directions[this.direction].frames
		const framecount = frames.length
		if ( framecount === 0 ) {
			this.sprites.mario.visible = false;
			return
		}

		const speed = this.dopesheet.actions[this.action].directions[this.direction].speed

		// if ( speed.x === 0 ) speed.x = 128
		// if ( speed.y === 0 ) speed.y = 128

		this.sprites.floor.x += speed.x * spent * -1 // times timediff
		this.sprites.floor.y += speed.y * spent * -1 // times timediff

		if ( this.sprites.floor.x >  128 ) this.sprites.floor.x -= 128
		if ( this.sprites.floor.y >   44 ) this.sprites.floor.y -= 44
		if ( this.sprites.floor.x < -128 ) this.sprites.floor.x += 128
		if ( this.sprites.floor.y <    0 ) this.sprites.floor.y += 44


		let frame = Math.floor( local * this.fps % framecount )

		let sheet = this.loader.resources["firemario"];

		// let name = "fire" + ('0000' + frame).substr( -4)
		let name    = frames[frame].image
		let zoffset = frames[frame].z

		this.sprites.mario.texture = sheet.textures[name]
		this.sprites.mario.frame   = frame
		this.sprites.mario.position.y = -zoffset
		this.sprites.mario.visible = true;

	}

}


