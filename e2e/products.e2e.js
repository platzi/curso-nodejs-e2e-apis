const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for /products path', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });

  describe('GET /products', () => {
    test('should return a products', async () => {
      const { statusCode, body } = await api.get(`/api/v1/products`);
      expect(statusCode).toEqual(200);
      const products = await models.Product.findAll();
      expect(body.length).toEqual(products.length);
      expect(body[0].category).toBeTruthy();
    });
  });


  afterAll(async () => {
    await downSeed();
    server.close();
  })
});

