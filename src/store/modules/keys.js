export default {

	namespaced: true,

	state: {
		keyEvent : null,
		pressed   : [],
	},

	getters: {
		pressed: (state) => { return state.pressed },
	},

	actions: {
	},

	mutations: {

		setKeyPress(state, event)   {
			state.keyEvent = event
			const index = state.pressed.indexOf(event.code)
			if ( index === -1 ) state.pressed.push(event.code)
			state.pressed.sort()
		},

		setKeyRelease(state, event) {
			state.keyEvent = event
			const index = state.pressed.indexOf(event.code)
			if ( index > -1 ) state.pressed.splice(index, 1)
			state.pressed.sort()
		},

	}

}