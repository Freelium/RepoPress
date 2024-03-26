const ConfigHandler = require('./ConfigHandler');
const { getOctokit } = require('@actions/github');

class PagesConfigHandler extends ConfigHandler {
  constructor(nextHandler = null) {
    super(nextHandler);
  }

  async handle(request) {
    console.log('Enabling GitHub Pages...');

    const octokit = getOctokit(request.token);
    const { owner, repo } = request;

    try {
      const response = await octokit.repos.createPagesSite({
        owner,
        repo,
        source: {
          branch: 'main',
          path: '/'
        }
      });

      console.log('GitHub Pages enabled:', response.data.html_url);

    } catch (error) {
      console.error('Failed to enable GitHub Pages:', error);
    }

    await super.handle(request);
  }
}

module.exports = PagesConfigHandler;
