const { getInput } = require('@actions/core');
const BranchConfigHandler = require('./handlers/BranchConfigHandler');
const CollaboratorsConfigHandler = require('./handlers/CollaboratorsConfigHandler');
const PagesConfigHandler = require('./handlers/PagesConfigHandler');
const ActionConfigHandler = require('./handlers/ActionConfigHandler');

async function run() {
    // Setup the chain
    const branchHandler = new BranchConfigHandler();
    const collaboratorHandler = new CollaboratorsConfigHandler();
    const pagesHandler = new PagesConfigHandler();
    const actionHandler = new ActionConfigHandler();

    branchHandler.setNext(collaboratorHandler);
    collaboratorHandler.setNext(pagesHandler);
    pagesHandler.setNext(actionHandler);

    // Create a request object if needed (for passing data between handlers)
    const request = {
        token: getInput('GITHUB_TOKEN', { required: true }),
        payload: getInput('METADATA_JSON', { required: true }),
    };

    await branchHandler.handle(request);
}

run().catch(error => console.error(`Action failed with error: ${error}`));
