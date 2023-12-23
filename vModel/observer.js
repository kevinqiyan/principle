class Observer{
    constructor() {
        this.sub = []
    }
    sub(callback) {
        this.sub.push(callback)
    }
    notify(value) {
        this.sub.forEach(callback => callback(value))
    }
}

class Model {
    constructor() {
        this.value = ''

        this.onchange = new Observer()
    }
    setValue(value) {
        this.value = value
        this.onchange.notify(value)
    }
    
}