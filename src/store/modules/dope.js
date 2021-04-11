export default {

	namespaced: true,

	state: {
		action          : 'idle',
		direction       : 'south',
		cell            : 'fire0003',
		pickModal       : false,
		actionsModal    : false,
	},

	getters: {
		getAction       : (state) => { return state.action       },
		getDirection    : (state) => { return state.direction    },
		getSelectedCell : (state) => { return state.cell         },
		openPickManager : (state) => { return state.pickModal    },
		openActions     : (state) => { return state.actionsModal },
	},

	mutations: {
		setAction(state, action)       { state.action         = action    },
		selectedCell(state, cell)      { state.cell           = cell      },
		setDirection(state, direction) { state.direction      = direction },
		setPickManager(state, modal)   { state.pickModal      = modal     },
		setManageAction(state, modal)  { state.actionsModal   = modal     },
	},

	actions: {

	},

}