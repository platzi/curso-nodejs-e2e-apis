const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { config } = require('../src/config/config');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Test for products ', () => {
  const endpoint = '/api/v1/products';
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(config.port);
    api = request(app);
    await upSeed();
  });

  describe('GET /products', () => {
    test('should return the products', async () => {
      const products = await models.Product.findAll();
      const response = await api.get(endpoint);

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(products.length);
      expect(response.body[0].category).toBeTruthy();
    });

    test('should return two products with limit = 2 and offset = 0', async () => {
      const limit = 2;
      const offset = 0;
      const response = await api.get(
        `${endpoint}?limit=${limit}&offset=${offset}`
      );

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(2);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
