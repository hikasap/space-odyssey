export class EventManager {
    constructor() {
        this.events = {};
    }

    subscribe(event, listener) {
        console.log(`Subscribing to event ${event}`);
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    unsubscribe(event, listener) {
        console.log(`Unsubscribing from event ${event}`);
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    emit(event, data) {
        console.log(`Emitting event ${event} with data: ${data}`);
        if (!this.events[event]) return;

        this.events[event].forEach(listener => listener(data));
    }
}