class ConfigHandler {
    constructor(nextHandler = null) {
        this.nextHandler = nextHandler;
    }

    setNext(handler) {
        this.nextHandler = handler;
    }

    async handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
    }
}
