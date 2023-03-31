const request = require('supertest');

const createApp = require('../src/app');
const { config } = require('../src/config/config');

describe('Test for app', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeEach(() => {
    app = createApp();

    app.get('/hello', (_req, res) => {
      res.status(200).json({ name: 'Robinson' });
    });

    server = app.listen(config.port);

    api = request(app);
  });

  test('GET /hello', async () => {
    const res = await api.get('/hello');
    expect(res).toBeTruthy();
  });

  afterEach(() => {
    server.close();
  });
});
