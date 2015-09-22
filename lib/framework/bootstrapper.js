import {Aura} from './core/aura'

const app = new Aura({
	name: 'app',
	debug: true,
	sources: {
		'default': 'src',
		'framework': 'lib/framework/aura_components'
	}
})

app.start()