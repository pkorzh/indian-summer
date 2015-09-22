import {
    base
}
from './base'
import {
    Logger
}
from './logger'

const logger = new Logger('Extensions').enable()

export class ExtManager {
    constructor() {
        this._extensions = []
    }

    add(ext) {
        if (this.initStarted) {
            throw new Error('Init extensions already called')
        }

        this._extensions.push(ext)

        return this
    }

    init() {
    	return new Promise((resolve, reject) => {
	        if (this.initStarted) {
	            throw new Error('Init extensions already called')
	        }

	        this.initStarted = true;

	        const extensions = this._extensions.slice(0),
	            initialized = [],
	            initStatus = this.initStatus;

	        (function _init(extDef) {
	            if (extDef) {
	                let ext = initExtension(extDef)

	                initialized.push(ext)

	                ext.then(() => {
	                    _init(extensions.shift())
	                })

	                ext.catch(err => {
	                    if (!err) {
	                        err = 'Unknown error while loading an extension';
	                    }

	                    if (!(err instanceof Error)) {
	                        err = new Error(err);
	                    }

	                    initStatus.reject(err);
	                })
	            } else if (extensions.length === 0) {
	                Promise.all(initialized).then((values) => {
	                    resolve(values)
	                })
	            }
	        })(extensions.shift())
    	})
    }
}


function initExtension(extDef) {
    return new Promise((resolve, reject) => {
    	System.import(extDef.ref).then(module => {
			Promise.all([module.default.initialize(extDef.context)]).then(() => {
				resolve(module.default)
			})
    	})
    })
}