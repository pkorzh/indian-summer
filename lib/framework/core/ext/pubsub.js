const events = (function() {
    var topics = {};
    var hOP = topics.hasOwnProperty;

    return {
        subscribe: function(topic, listener) {
            if (!hOP.call(topics, topic)) topics[topic] = []

            var index = topics[topic].push(listener) - 1

            return {
                remove: function() {
                    delete topics[topic][index];
                }
            }
        },
        publish: function(topic, info) {
            return new Promise((resolve, reject) => {
                if (!hOP.call(topics, topic)) {
                    resolve()
                }

                Promise.all(topics[topic].map(fn => fn(info))).then(resolve, reject)
            })
        }
    }
})()

export default {
    initialize(app) {
        app.sandbox.pub = events.publish
        app.sandbox.sub = events.subscribe
    }
}