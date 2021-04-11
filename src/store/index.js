import { createStore, createLogger } from 'vuex'

import main  from './modules/main'
import file  from './modules/file'
import dope  from './modules/dope'
import mouse from './modules/mouse'
import keys  from './modules/keys'

export default createStore({
	modules: {
		main,
		file,
		mouse,
		keys,
		dope,
	},
})