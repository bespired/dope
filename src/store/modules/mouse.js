export default {

	namespaced: true,

	state: {
		ScrollMove: false,
		ScrollPos : { x: 0, y: 0},
	},

	getters: {
		getScrollMove: (state) => { return state.ScrollMove  },
		getScrollPos:  (state) => { return state.ScrollPos   },
		getScrollX:    (state) => { return state.ScrollPos.x },
		getScrollY:    (state) => { return state.ScrollPos.y },
	},

	actions: {
	},

	mutations: {
		setScrollMove(state, setting) { state.ScrollMove  = setting },
		setScrollPosX(state, x) { state.ScrollPos.x = x },
		setScrollPosY(state, y) { state.ScrollPos.y = y },
	}

}