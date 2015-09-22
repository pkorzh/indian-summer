class Component {}

export default {
    initialize(app) {
        Component.load = function(def) {
            return new Promise((resolve, reject) => {
                Promise.all([
                    System.import(`${app.config.sources[def.source]}/${def.name}/index`),
                    System.import(`${app.config.sources[def.source]}/${def.name}/${def.name.split('/').pop()}.html!txt`)
                ]).then(values => {
                    const module = values[0],
                        html = values[1]

                    const sandbox = app.sandboxes.create(def.ref)
                    sandbox.logger.name = `Component ${def.name}(${sandbox.logger.name})`

                    const originalHTML = def.el.innerHTML

                    if (html.length != 0) {
                        def.el.innerHTML = html

                        const transcludeEl = def.el.querySelector('[data-ref="transclude"]')

                        if (transcludeEl != null) {
                            transcludeEl.innerHTML = originalHTML
                        }
                    }

                    const component = new module.default()

                    Object.assign(component, def, {sandbox: sandbox})

                    component.sandbox.start(def.el, {
                        reset: true
                    }).then(_ => {
                        resolve(component)
                    })
                })
            })
        }

        Component._findElementsWithComponents = function _findElementsWithComponents(el) {
            const res = []

            for (let element of el.children) {
                if (element.getAttribute('data-component')) {
                    res.push(element)
                } else {
                    res.push.apply(res, _findElementsWithComponents(element))
                }  
            }

            return res
        }


        Component.parse = function(el) {
            return Component._findElementsWithComponents(el).map(element => {
                const fullName = element.getAttribute('data-component'),
                    nameParts = fullName.split('@'),
                    name = nameParts.shift(),
                    source = nameParts.shift() || 'default'

                return Object.assign({
                    el: element,
                    name: name,
                    source: source
                }, JSON.parse(JSON.stringify(element.dataset)))
            })
        }

        Component.startAll = function(el) {
            return new Promise((resolve, reject) => {
                Promise.all(Component.parse(el).map(def => Component.load(def))).then(components => {
                    resolve(components)
                })
            })
        }

        app.sandbox.start = function(el, options = {}) {
            let children = this._children || []

            if (options.reset) {
                children.map(_ => _.stop())
                children = []
            }

            return Component.startAll(el).then(components => {
                components.map(component => {
                    component.sandbox._component = component
                    component.sandbox._parent = this

                    component.initialize()

                    children.push(component.sandbox)
                })

                this._children = children;
            })
        }
    },

    afterAppStart(app) {
        app.core.appSandbox = app.sandboxes.create(app.ref).start(document.body)
    }
}