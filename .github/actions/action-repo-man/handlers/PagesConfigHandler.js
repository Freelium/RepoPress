const ConfigHandler = require('./ConfigHandler');
const { getOctokit } = require('@actions/github');

class PagesConfigHandler extends ConfigHandler {
  constructor(nextHandler = null) {
    super(nextHandler);
  }

  extractConfig(payload) {
    const repoConfig = payload.template_payloads
    .find(entry => entry.name === 'repo')
    .ccplus;

    return {
      ...repoConfig.repository_details,
      ...repoConfig.pages
    };
  }

  async handle(request) {
    console.log('Enabling GitHub Pages...');

    const octokit = getOctokit(request.token);
    const config = this.extractConfig(request.payload);

    console.log('Token:', request.token, 'Config:', JSON.stringify(config));
    if (config.enabled) {
      console.log('Enabling GitHub Pages');
      await this.updatePages(octokit, config);
    } else {
      // This should attempt to disable pages
      console.log('Skipping GitHub Pages');
    }

    await super.handle(request);
  }

  async updatePages(octokit, config) {
    try {
      const args = {
        owner: config.owner,
        repo: config.name,
        source: {
          branch: config.branch,
          path: config.directory
        }
      };
      console.log('Update args', JSON.stringify(args));
      const response = await octokit.repos
        .createPagesSite(args);

      console.log('GitHub Pages enabled:', response.data.html_url);

    } catch (error) {
      console.error('Failed to enable GitHub Pages:', error);
    }
  }
}

module.exports = PagesConfigHandler;
