export default class PubSub {
    private events

    constructor() {
        this.events = {}
    }

    subscribe(event, callback) {
        let self = this
        if(!self.events.hasOwnProperty(event)) {
            self.events[event] = []
        }

        return self.events[event].push(callback)
    }

    publish(event, data = {}) {
        let self = this
        if(!self.events.hasOwnProperty(event)) {
            return []
        }

        return self.events[event].map(callback => callback(data)) 
    }
}