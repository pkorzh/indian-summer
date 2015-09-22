import {
    base
}
from './base'
import {
    ExtManager
}
from './aura.extensions'
import {
    Logger
}
from './logger'

export class Aura {
    constructor(config) {
        this.extManager = new ExtManager()

        this.ref = config.name || base.uniqueId('aura_')

        this.config = config || {}

        const appSandboxes = {}
        const baseSandbox = Object.create(base)

        this.core = Object.create(base);

        this.sandbox = baseSandbox;

        this.logger = new Logger(this.ref).enable();

        this.sandboxes = {
            create: (ref, options) => {
                if (appSandboxes[ref]) {
                    throw new Error(`Sandbox with ref ${ ref } already exists.`)
                }

                let sandbox = Object.create(baseSandbox);

                sandbox.ref = ref || base.uniqueId('sandbox-');

                sandbox.logger = new Logger(sandbox.ref);

                appSandboxes[sandbox.ref] = sandbox;

                let debug = config.debug;
                if (debug === true || debug.enable) {
                    sandbox.logger.enable();
                }

                return Object.assign(sandbox, options || {});
            },
            get: (ref) => {
                return appSandboxes[ref];
            }
        }

        this.components = {
            addSource: (name, baseUrl) => {
                if (config.sources[name]) {
                    throw new Error(`Components source '${ name }' is already registered`)
                }
                config.sources[name] = baseUrl
            }
        }

        this.use('lib/framework/core/ext/pubsub')
        this.use('lib/framework/core/ext/components')
    }

    use(ref) {
        this.extManager.add({
            ref: ref,
            context: this
        })

        return this
    }

    start() {
        if (this.started) {
            this.logger.error('Aura already started!')
            return
        }

        this.logger.log('Starting app')

        this.started = true

        this.extManager.init().then((exts) => {
            exts.filter(ext => typeof ext.afterAppStart === 'function')
                .map(ext => ext.afterAppStart(this))
        }, (err) => {
            this.logger.error('Error initializing app:', this.config.name, arguments);
            this.stop();
        })
    }

    stop() {
        this.started = false;
    }
}