<template>
	<div class="timeline" ref="frames" v-if="fileLoaded">
		<div class="frames" :style="timeshift()" v-if="frames">
			<template v-for="frame in frames">
				<div class="frame" :class="{selected:frame.selected, isNew:frame.isNew, }" @click="select($event, frame)">
					<div class="horizon" />
					<div class="offset" :style="zoffset(frame)" />
					<img :src="atlasImage" :style="clip(frame)" />
					<div class="label">{{ frame.frame }}:{{ frame.image }}</div>
				</div>
			</template>
		</div>
		<div class="timebar" :class="{soft: framesFit}" :key="`scrollUpdate-${scrollUpdate}`" @mousedown="mouseDown">
			<div class="barhandle" :style="scrollBar()" :data-key="`scroll-${scrollPosX}`"></div>
		</div>
	</div>
	<div class="placeholder" v-else>
		loading
	</div>
	<div class="actions">
		<button @click="rotate()">rotate all</button>
		<button class="plus" :disabled="!hasSelected" @click="setZoffset(-1)">z-</button>
		<button class="plus" :disabled="!hasSelected" @click="setZoffset(0) ">z0</button>
		<button class="plus" :disabled="!hasSelected" @click="setZoffset(1) ">z+</button>
		<button @click="append()">append</button>
		<button @click="insert()" :disabled="!hasSelected">insert</button>
		<button @click="remove()" :disabled="!hasSelected" class="orange">remove</button>
		<button @click="selectall(false)" class="blue" :disabled="!hasSelected">deselect all</button>
		<button @click="selectall(true)" class="blue">select all</button>
		<button @click="copy()" :disabled="!hasSelected" class="blue">copy </button>
		<button @click="paste()" :disabled="copybuffer.length === 0">paste </button>
	</div>
</template>
<script>
// import firemario from '../assets/sheets/firemario.json'

export default {
	name: 'DopeTimeline',

	mounted() {
		this.scrollUpdate++;
		this.$store.dispatch('file/getDopeFile')
	},

	created() {
		window.addEventListener("resize", this.resized);
	},

	unmounted() {
		window.removeEventListener("resize", this.resized);
	},

	data() {
		return {
			scrollUpdate: 0,
			startframeOffs: 0,
			mouseStartX: 0,
			framesFit: true,
			copybuffer: []
		}
	},


	computed: {
		action() { return this.$store.getters['dope/getAction'] },
		direction() { return this.$store.getters['dope/getDirection'] },
		selectedCell() { return this.$store.getters['dope/getSelectedCell'] },

		fileLoaded() { return this.$store.getters['file/fileLoaded'] },
		atlasSheet() { return this.$store.getters['file/atlasSheet'] },
		atlasImage() { return this.$store.getters['file/atlasImage'] },

		frames: {
			get() {
				return this.$store.getters['file/frames']([this.action, this.direction])
			},
			set(value) {
				this.$store.commit('file/setFrames', {
					frames: value,
					action: this.action,
					direction: this.direction
				});
			}
		},
		fps: {
			get() { return this.$store.getters['file/fps']([this.action, this.direction]) },
			set(value) { this.$store.commit('file/setFps', { action: this.action, direction: this.direction, fps: value }) }
		},

		scrollPosX() { return this.$store.getters['mouse/getScrollX'] },
		scrollMove() { return this.$store.getters['mouse/getScrollMove'] },

		hasSelected() {
			return this.selectcount > 0
		},

		selectcount() {
			let count = 0
			this.frames.forEach(f => { count += f.selected })
			return count
		}

	},


	methods: {

		clone(data) {
			if ((data === undefined) || (data === null)) return data
			return JSON.parse(JSON.stringify(data))
		},

		rotate() {
			const cells = Object.keys(this.atlasSheet).length
			const skip = Math.floor(cells / 8)

			let list = []
			const regex = /([^0-9]*)([0-9]*)/gm;
			this.frames.forEach(p => {

				const regex = /([^0-9]*)([0-9]*)/gm;
				const m = regex.exec(p.image)
				const name = m[1]
				let number = (parseInt(m[2], 10) + skip) % cells
				number = number > 0 ? number : cells

				const padded = `0000${number}`.substr(-4)

				list.push({ frame: p.frame, image: `${name}${padded}`, z: p.z })

			})

			this.frames = this.clone(list)
		},

		append() {

			let images = [];
			let buffer = this.clone(this.frames)
			if (this.selectedCell !== null) {
				// use the image from the picklist
				images = [this.selectedCell]
			} else {
				// else collect selected from the timeline
				buffer.forEach((b) => { if (b.selected) { images.push(b.image) } })
			}
			if (images.length === 0) images.push('fire0001')

			images.forEach((img) => {
				buffer.push({ frame: buffer.length + 1, image: img, selected: false, isNew: true })
			})
			this.frames = buffer
			this.scrollUpdate++
		},

		insert() {
			let buffer = []
			let images = []
			let frameid = 1
			let runstate = 'find'

			if (this.selectedCell) {
				for (let idx = 0; idx < this.frames.length; idx++) {
					buffer.push({
						frame: frameid++,
						image: this.frames[idx].image,
						selected: this.frames[idx].selected
					})
					if (this.frames[idx].selected) {
						buffer.push({ frame: frameid++, image: this.selectedCell, selected: false, isNew: true })
					}
				}
				this.frames = buffer
				this.scrollUpdate++
				return
			}

			for (let idx = 0; idx < this.frames.length; idx++) {
				let copy = this.clone(this.frames[idx])
				copy.frame = frameid++
				copy.isNew = false

				if (runstate === 'selected') {
					if (copy.selected) {
						images.push(copy.image)
						buffer.push(copy)
					} else {
						images.forEach((img) => {
							buffer.push({ frame: frameid++, image: img, selected: false, isNew: true })
						})
						images = []
						runstate === 'find'
						buffer.push(copy)
					}
				} else {
					buffer.push(copy)
					if (copy.selected) {
						images.push(copy.image)
						runstate = 'selected'
					}
				}
			}
			if (images.length > 0) {
				images.forEach((img) => {
					buffer.push({ frame: frameid++, image: img, selected: false, isNew: true })
				})
			}
			this.frames = buffer
			this.scrollUpdate++
		},

		remove() {
			let buffer = this.clone(this.frames)
			for (let idx = buffer.length - 1; idx >= 0; idx--) {
				if (buffer[idx].selected) {
					buffer.splice(idx, 1)
				}
			}
			buffer.forEach((buf, idx) => { buf.frame = 1 + idx })

			this.frames = buffer
			this.scrollUpdate++
		},

		selectall(setting) {
			this.frames.forEach(f => {
				f.selected = setting
				f.isNew = false
			})
		},

		copy() {
			this.copybuffer = { frames: [], fps: this.fps }
			this.frames.forEach(f => {
				if (f.selected) this.copybuffer.frames.push(this.clone(f));
			})
		},

		paste() {
			let buffer = this.clone(this.frames)
			this.fps = this.copybuffer.fps
			if (!this.hasSelected) {
				this.frames = this.copybuffer.frames
			} else {
				// maybe append?
				this.frames = this.copybuffer.frames
			}
		},

		setZoffset(dir) {
			if (!this.hasSelected) return
			this.frames.forEach(f => {
				if (f.selected) f.z = dir === 0 ? 0 : f.z + dir
			})
		},

		zoffset(frame) {
			const zoffset = -frame.z || 0
			return `transform: translate( 0, ${zoffset}px)`
		},

		// mixin ?
		clip(frame) {
			if (frame.image === undefined) { return "display:none";
				console.log(frame); }
			const dimens = this.atlasSheet[frame.image].frame
			const source = this.atlasSheet[frame.image].spriteSourceSize
			const zoffset = -frame.z || 0
			const left = dimens.x
			const top = dimens.y
			const right = left + dimens.w
			const bottom = top + dimens.h
			const offsx = -left + source.x
			const offsy = -top + source.y

			const polygon = `${left}px ${top}px, ${right}px ${top}px,${right}px ${bottom}px, ${left}px ${bottom}px`

			return `clip-path: polygon(${polygon}); left: ${offsx}px; top: ${offsy}px; transform: translate( 0, ${zoffset}px)`
		},

		select(event, frame) {
			this.frames.forEach(f => { f.isNew = false })
			if (!event.shiftKey) {
				this.frames.forEach(f => {
					f.selected = f.frame !== frame.frame ? false : !frame.selected
				})
			} else {
				frame.selected = !frame.selected
			}
		},

		scrollBar() {
			const div = this.$refs['frames'];
			const reset = `margin-left:0px; width:0px;`

			if ((div === undefined) || (div === null)) {
				this.framesFit = true
				this.startframeOffs = 0
				return reset
			}

			let rect = div.getBoundingClientRect();
			if (this.frames.length * 130 < rect.width) {
				this.framesFit = true
				this.startframeOffs = 0
				return reset
			}

			let width = rect.width / this.frames.length
			let scrollX = this.scrollPosX - 20 - width / 2
			let space = rect.width - width - 6
			let left = Math.max(0, Math.min(space, scrollX))

			let large = this.frames.length * 130
			let room = large - rect.width

			this.framesFit = false
			this.startframeOffs = -(left / space) * room;

			return `margin-left:${left}px; width:${width}px;`

		},

		timeshift() {
			let timeshift = this.startframeOffs
			let width = this.frames.length * 130
			return `transform: translate(${timeshift}px, 0px); width: ${width}px`
		},

		mouseDown(event) {
			this.$store.commit('mouse/setScrollPosX', event.x)
			this.$store.commit('mouse/setScrollMove', true)
		},

		resized(event) {
			this.scrollUpdate++
		}

	}
}
</script>
<style scoped lang="scss">
@import "../assets/sass/colors.scss";

.frames {
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	padding-bottom: 20px;
}

.offset,
.horizon {
	min-height: 1px;
	background-color: rgba(127, 127, 127, 0.5);
	width: 100%;
	position: absolute;
	bottom: 33px;
}

.offset {
	background-color: rgba(127, 127, 255, 0.5);
}

// .z-align {
// 	position: absolute;
// 	display: flex;
// 	flex-direction: column;
// 	flex-wrap: wrap;
//     width: 20px;
//     top: 2px;
//     right: 2px;
// 	button {
// 		width: 20px;
// 		height: 20px;
// 		padding: 0;
// 		min-width: 20px;
// 	}
// }

.frame {
	transition: background-color 150ms linear;

	display: inline-block;
	position: relative;
	width: 128px;
	height: 190px;
	// overflow: hidden;
	background-color: $bggrey;
	border-radius: 6px;
	margin: 0 2px 0 0;

	.label {
		position: absolute;
		bottom: -18px;
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
		width: 124px;
		height: 186px;
		border-radius: 6px;
		transition: border-color 500ms linear;
	}

	&.isNew:after {
		content: "";
		border: 2px solid $green;
		position: absolute;
		width: 124px;
		height: 186px;
		border-radius: 6px;
		transition: border-color 500ms linear;
	}
}

.actions {
	white-space: nowrap;
	display: flex;

	button {
		margin-right: 4px;
		user-select: none;

		&.plus {
			max-width: 30px;
			min-width: 30px;
			text-align: center;
			padding: 0;
		}
	}

}

.timeline {
	margin-bottom: 12px;
	overflow: hidden;
	min-height: 238px;
}

.placeholder {
	min-height: 240px;
	margin-bottom: 12px;
	background-color: $bggrey;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.timebar {
	// border: 1px solid $border;
	background-color: $bggrey;
	padding: 2px;
	border-radius: 3px;

	&.soft {
		opacity: 0.1
	}

	.barhandle {
		height: 14px;
		border-radius: 2px;
		background-color: white;
		transition: border-color 1500ms linear;

		&:hover {
			background-color: $blue
		}
	}
}

.selectOff .barhandle {
	background-color: $blue;
}
</style>