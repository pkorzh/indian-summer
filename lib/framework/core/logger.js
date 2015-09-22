export class Logger {
	constructor(name) {
		this._name = name
		this._enabled = false

		this._log = () => {}
		this._warn = () => {}
		this._error = () => {}
	}

	get enabled() {
		return this._enabled
	}

	enable() {
		const logFns = [
			'log',
			'warn',
			'error'
		]

		for(let logFn of logFns) {
			console[logFn] = Function.prototype.call.bind(console[logFn], console)
		}

		this._log = console.log || () => {}
		this._warn = console.warn || this._log
		this._error = console.error || this._log
		this._enabled = true

		return this
	}

	get name() {
		return this._name
	}

	set name(name) {
		this._name = name
	}

	write(output, args) {
		const parameters = Array.prototype.slice.call(args)
		parameters.unshift(`${ this.name }:`)
		output.apply(console, parameters)
	}
	log() {
		this.write(this._log, arguments)
	}
	warn() {
		this.write(this._warn, arguments)
	}
	error() {
		this.write(this._error, arguments)
	}
}