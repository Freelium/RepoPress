class ActionConfigHandler extends ConfigHandler {
    async handle(request) {
        console.log('Configuring repository for Action use...');
        // Implement configuration logic for using repo as an action

        await super.handle(request);
    }
}
