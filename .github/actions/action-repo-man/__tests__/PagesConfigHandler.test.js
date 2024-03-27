const nock = require('nock');
const PagesConfigHandler = require('../handlers/PagesConfigHandler');
const { getOctokit } = require('@actions/github');
const payload = require('./fixtures/payload.json')

const mockCreatePagesSite = jest.fn().mockResolvedValue({ data: { html_url: 'https://example.com' } });

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn().mockImplementation(token => ({
    repos: {
      createPagesSite: mockCreatePagesSite
    }
  }))
}));

describe('PagesConfigHandler', () => {
  const mockRequest = {
    token: 'fake-token',
    payload: payload
  };

  beforeEach(() => {
    // Prevent actual HTTP requests during tests
    nock.disableNetConnect();
    jest.clearAllMocks();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('enables GitHub Pages when enabled in config', async () => {
    const handler = new PagesConfigHandler();

    await handler.handle(mockRequest);

    // Assertions to verify that GitHub API was called with the expected parameters
    expect(getOctokit(mockRequest.token).repos.createPagesSite).toHaveBeenCalledWith({
      owner: 'freelium',
      repo: 'meep',
      source: { branch: 'gh-pages', path: '/docs' }
    });
  });
});
