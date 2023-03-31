const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { config } = require('../src/config/config');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Test for app', () => {
  const endpoint = '/api/v1/auth';
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(config.port);
    api = request(app);
    await upSeed();
  });

  describe('POST /login', () => {
    test('Should return 401', async () => {
      // Arrange
      const inputData = {
        email: 'emailinvalid@.com',
        password: 'password123',
      };

      // Act
      const response = await api.post(`${endpoint}/login`).send(inputData);

      // Assert
      expect(response.statusCode).toBe(401);
    });

    test('Should return 200', async () => {
      // Arrange
      const user = await models.User.findByPk(1);
      const inputData = {
        email: user.email,
        password: 'admin123',
      };

      // Act
      const response = await api.post(`${endpoint}/login`).send(inputData);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body.access_token).toBeTruthy();
      expect(response.body.user.email).toEqual(user.email);
      expect(response.body.user.password).toBeUndefined();
    });
  });

  afterAll(async () => {
    downSeed();
    server.close();
  });
});
