import PubSub from '../lib/pubsub'
import '../lib/proxy'

export default class Store {
    private actions
    private mutations
    private state
    private status
    private events

    constructor(params) {
        let self = this
        self.actions = {}
        self.mutations = {}
        self.state = {}
        self.status = 'resting'
        self.events = new PubSub()
        if (params.hasOwnProperty("actions")) {
            self.actions = params.actions
        }
        if (params.hasOwnProperty("mutations")) {
            self.mutations = params.mutations
        }
        let proxy = window.Proxy
        self.state = new proxy((params.state || {}), {
            set: function (state, key:string, value) {
                state[key] = value
                self.events.publish("stateChange", self.state)
                if (self.status != "mutation") {
                    console.warn(`You should use a mutation to set ${key}`)
                }
                self.status = 'resting'
                return true
            }
        })
    }

    dispatch(actionKey, payload) {
        let self = this
        if (typeof self.actions[actionKey] !== 'function') {
            console.error(`Action ${actionKey} doesn't exist`)
            return false
        }
        console.groupCollapsed(`Action:${actionKey}`)
        self.status = 'action'
        self.actions[actionKey](self, payload)
        console.groupEnd()
        return true
    }

    commit(mutationKey, payload) {
        let self = this
        if (typeof self.mutations[mutationKey] !== 'function') {
            console.log(`Mutation ${mutationKey} dosen't exist`)
            return false
        }
        self.status = 'mutation'
        let newState = self.mutations[mutationKey](self.state, payload)
        self.state = Object.assign(self.state, newState)
        return true
    }
}