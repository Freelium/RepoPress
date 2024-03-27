class ConfigHandler {
  constructor(nextHandler = null) {
    this.nextHandler = nextHandler;
  }

  setNext(handler) {
    this.nextHandler = handler;
  }

  extractConfig(payload) {
    return payload;
  }

  async handle(request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
  }
}

module.exports = ConfigHandler;
