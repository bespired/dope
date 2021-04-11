const clipFrame = {

	methods:
	{
		clip(frame){

			if ( frame === null ) return 'display: none'

			let dimens = frame.frame
			let source = frame.spriteSourceSize

			if ( typeof frame === 'string' ) {
				dimens = this.atlasSheet[frame].frame
				source = this.atlasSheet[frame].spriteSourceSize
			}

			const left   = dimens.x
			const top    = dimens.y
			const right  = left + dimens.w
			const bottom = top  + dimens.h
			const offsx  = -left + source.x
			const offsy  = -top  + source.y - 16

			const polygon  = `${left}px ${top}px, ${right}px ${top}px,${right}px ${bottom}px, ${left}px ${bottom}px`
			const scale    = `transform: scale(0.5)`
			const origin   = `transform-origin: ${-offsx}px ${-offsy}px`
			const clippath = `clip-path: polygon(${polygon}); left: ${offsx}px; top: ${offsy}px`

			return `${clippath};${scale};${origin};`
		},

		latest(frame){
			const last = frame.directions['south-west'].frames.length - 1
			if ( last < 0 ) return null

			return frame.directions['south-west'].frames[last].image
		}

	}

}

export default clipFrame