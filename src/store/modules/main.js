export default {

	namespaced: true,

	state: {
		count     : 0,
	},

	getters: {
		getCount     : (state) => { return state.count     },
	},

	actions: {

	},

	mutations: {
		setCount(state, count) { state.count = count },
	}

}