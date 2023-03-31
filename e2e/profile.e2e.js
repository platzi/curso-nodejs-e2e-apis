const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { config } = require('../src/config/config');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Test for app', () => {
  const endpoint = '/api/v1/profile';
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(config.port);
    api = request(app);
    await upSeed();
  });

  describe('GET /my-user', () => {
    test('Should return 401', async () => {
      const response = await api.get(`${endpoint}/my-user`).set({
        Authorization: `Bearer 123456`,
      });

      expect(response.statusCode).toEqual(401);
    });
  });

  describe('GET /my-user', () => {
    let user = null;
    let accessToken = null;
    beforeAll(async () => {
      user = await models.User.findByPk(1);
      const inputData = {
        email: user.email,
        password: 'admin123',
      };
      const auth = await api.post(`/api/v1/auth/login`).send(inputData);
      accessToken = auth.body.access_token;
    });

    test('Should return 200', async () => {
      const response = await api.get(`${endpoint}/my-user`).set({
        Authorization: `Bearer ${accessToken}`,
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body.email).toEqual(user.email);
    });

    afterAll(() => {
      accessToken = null;
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
