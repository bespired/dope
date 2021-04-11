export function fixFile(state) {

	// make sure all directions of all actions exist

	const count = Object.keys(state.sheetdata.frames).length
	const skip  = Math.floor( count / 8 )

	const speeds = {
		"north" :       { x:  0, y: -1 },
		"north-east" :  { x:  1, y: -1 },
		"east" :        { x:  1, y:  0 },
		"south-east" :  { x:  1, y:  1 },
		"south" :       { x:  0, y:  1 },
		"south-west" :  { x: -1, y:  1 },
		"west" :        { x: -1, y:  0 },
		"north-west" :  { x: -1, y: -1 },
	}

	const keys = Object.keys(state.dopedata.actions)

	keys.forEach( action =>{
		let filedirections = state.dopedata.actions[action].directions
		let directionkeys  = Object.keys(filedirections)
		let fps      = 30
		let frames   = []
		let picklist = []
		let diridx   = 0
		let rotate   = 0

		// find some values... for if needed
		state.directions.forEach( direction => {
			let exists = directionkeys.indexOf(direction)
			if ( exists >= 0 ){
				fps      = state.clone(state.dopedata.actions[action].directions[direction].fps)
				frames   = state.clone(state.dopedata.actions[action].directions[direction].frames)
				picklist = state.clone(state.dopedata.actions[action].directions[direction].picklist)
				diridx   = parseInt(Object.keys(state.directions).find(key => state.directions[key] === direction), 10)
			}
		})

		state.directions.forEach( direction => {
			let exists = directionkeys.indexOf(direction)
			if ( exists < 0 ){
				let idx = parseInt(Object.keys(state.directions).find(key => state.directions[key] === direction))
				rotate = (diridx + idx) % 8

				let cells= []
				let plist= {}
				const regex = /([^0-9]*)([0-9]*)/gm;
				frames.forEach( p => {
					const regex = /([^0-9]*)([0-9]*)/gm;
					const m = regex.exec(p.image)
					const name   = m[1]
					const number = ( parseInt(m[2], 10) + skip * rotate ) % count
					const padded = `0000${number}`.substr(-4)

					plist[`${name}${padded}`] = `${name}${padded}`
					cells.push({ frame: p.frame,  image: `${name}${padded}` })

				})

				state.dopedata.actions[action].directions[direction] = {
					fps      : fps,
					frames   : state.clone(cells),
					picklist : Object.values(plist).sort(),
				}
			}
		})
		// fix Z in frames...
		state.directions.forEach( direction => {
			const frames = state.dopedata.actions[action].directions[direction].frames
			frames.forEach( f => { f.z = f.z || 0 })
		})
	})

}

export default fixFile
