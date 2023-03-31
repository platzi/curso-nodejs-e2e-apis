const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { config } = require('../src/config/config');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Test for /categories path', () => {
  const endpoint = '/api/v1/categories';
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(config.port);
    api = request(app);
    await upSeed();
  });

  describe('POST /categories with admin user', () => {
    let accessToken = null;

    beforeAll(async () => {
      const user = await models.User.findByPk(1);
      const inputData = {
        email: user.email,
        password: 'admin123',
      };
      const auth = await api.post(`/api/v1/auth/login`).send(inputData);
      accessToken = auth.body.access_token;
    });

    test('Should return 401', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };
      const response = await api.post(endpoint).send(inputData);

      expect(response.statusCode).toEqual(401);
    });

    test('Should return 201', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };
      const response = await api
        .post(endpoint)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send(inputData);
      expect(response.statusCode).toEqual(201);

      const category = await models.Category.findByPk(response.body.id);
      expect(response.body.name).toEqual(category.name);
      expect(response.body.image).toEqual(category.image);
    });

    afterAll(() => {
      accessToken = null;
    });
  });

  describe('POST /categories with costumer user', () => {
    let accessToken = null;

    beforeAll(async () => {
      const user = await models.User.findByPk(2);
      const inputData = {
        email: user.email,
        password: 'costumer123',
      };
      const auth = await api.post(`/api/v1/auth/login`).send(inputData);
      accessToken = auth.body.access_token;
    });

    test('Should return 401 without token', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };
      const response = await api.post(endpoint).send(inputData);

      expect(response.statusCode).toEqual(401);
    });

    test('Should return 401 with customer token', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };
      const response = await api
        .post(endpoint)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send(inputData);
      expect(response.statusCode).toEqual(401);
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
