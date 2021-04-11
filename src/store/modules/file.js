import fixFile from "../../modules/fixFile.js"

export default {

	namespaced: true,

	state: {
		dopedata    : null,
		sheetdata   : null,
		directions: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west' ],

		clone(data) { return JSON.parse(JSON.stringify(data)) },
	},

	getters: {
		fileLoaded  : (state) => { return state.sheetdata !== null            },
		atlasSheet  : (state) => { return state.sheetdata.frames              },
		atlasImage  : (state) => { return state.dopedata.sheet.atlasImage     },
		atlasName   : (state) => { return state.dopedata.name                 },
		actionNames : (state) => { return Object.keys(state.dopedata.actions) },
		dopeSheet   : (state) => { return state.dopedata                      },
		directions  : (state) => { return state.directions                    },
		actions     : (state) => { return state.dopedata.actions              },

		fps         : (state) => (arr) => {
			return (state.dopedata === null) ? 0 : state.dopedata.actions[arr[0]].directions[arr[1]].fps
		},
		frames      : (state) => (arr) => {
			return (state.dopedata === null) ? [] : state.dopedata.actions[arr[0]].directions[arr[1]].frames
		},
		speed      : (state) => (arr) => {
			return (state.dopedata === null) ? [] : state.dopedata.actions[arr[0]].directions[arr[1]].speed
		},
		picklist    : (state) => (arr) => {
			return (state.dopedata === null) ? [] : state.dopedata.actions[arr[0]].directions[arr[1]].picklist
		}
	},


	mutations: {
		fixFile(state) {
			fixFile(state)
		},
		setFps(state, payload) {
			state.dopedata.actions[payload.action].directions[payload.direction].fps = payload.fps
		},
		setSpeedX(state, payload) {
			state.dopedata.actions[payload.action].directions[payload.direction].speed.x = payload.speed
		},
		setSpeedY(state, payload) {
			state.dopedata.actions[payload.action].directions[payload.direction].speed.y = payload.speed
		},
		setFrames(state, payload) {
			state.dopedata.actions[payload.action].directions[payload.direction].frames = payload.frames
		},
		setPicklist(state, payload) {
			state.dopedata.actions[payload.action].directions[payload.direction].picklist = payload.picklist
		},
		inUsePicklist(state, payload) {
			const frames = state.dopedata.actions[payload.action].directions[payload.direction].frames
			const picklist= []
			frames.forEach( f => { if (picklist.indexOf(f.image) === -1) picklist.push(f.image) })
			picklist.sort()
			state.dopedata.actions[payload.action].directions[payload.direction].picklist = picklist
		},
	},

	actions: {

		getDopeFile(context) {
			const url = '/dopesheets/firemario.json'
			fetch(url)
				.then(response => response.json())
				.then(data => {
					context.state.dopedata = data
					context.dispatch('getSheetFile')
				})
				.catch(error => {
					console.error('Error:', error);
				});
		},

		getSheetFile(context) {
			const url = context.state.dopedata.sheet.atlasSheet
			fetch(url)
				.then(response => response.json())
				.then(data => {
					context.state.sheetdata = data
					context.commit('fixFile')
				})
				.catch(error => {
					console.error('Error:', error);
				});
		},

		createNewAction(context, name) {
			name = name.replace(/[0-9]/g, '').toLowerCase();
			if (name.length === 0) return

			let exists = context.state.dopedata.actions[name]
			if (exists !== undefined) return

			const state = context.state
			const directions = state.clone(state.directions)
			let action = {}
			directions.forEach(d => {
				action[d] = {
					fps: 15, x: 0, y: 0, frames: [], picklist: []
				}
			})
			context.state.dopedata.actions[name]= { directions: action }
			console.log(state.dopedata.actions)
		},

		loadDopeFile(context) {
			const dopefile = localStorage.getItem('dopefile')
			if ((dopefile === undefined ) || (dopefile === null )) return
			const dopedata = JSON.parse(dopefile)
			if ((dopedata === undefined ) || (dopedata === null ) || (dopedata === '' )) return
			context.state.dopedata = dopedata
			fixFile(context.state)
		},

		saveDopeFile(context) {
			const json = JSON.stringify(context.state.dopedata)
			localStorage.setItem('dopefile', json)
		},

		downloadDopeFile(context) {

			const a = document.createElement('a')
    		document.body.appendChild(a)

    		const json = JSON.stringify(context.state.dopedata)
            const blob = new Blob([json], {type: "octet/stream"})

    		const url = window.URL.createObjectURL(blob);
    		a.href = url;
    		a.download = `${context.state.dopedata.name}.json`
    		a.click();
    		setTimeout(() => {
      			window.URL.revokeObjectURL(url);
      			document.body.removeChild(a);
    		}, 0)
		}

	},


}