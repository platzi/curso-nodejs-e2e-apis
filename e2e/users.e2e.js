const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { config } = require('../src/config/config');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Test for app', () => {
  const endpoint = '/api/v1/users';
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(config.port);
    api = request(app);
    await upSeed();
  });

  describe('GET /users', () => {
    test('should return a user', async () => {
      const user = await models.User.findByPk(1);
      const response = await api.get(`${endpoint}/${user.id}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body.id).toEqual(user.id);
      expect(response.body.email).toEqual(user.email);
    });
  });

  describe('POST /users', () => {
    test('Invalid password - Should return a 400 Bad request', async () => {
      // Arrange
      const inputData = {
        email: 'r@gmail.com',
        password: '-----',
      };

      // Act
      const response = await api.post(endpoint).send(inputData);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/password/);
    });

    test('Invalid email - Should return a 400 Bad request', async () => {
      // Arrange
      const inputData = {
        email: 'emailinvalid@.com',
        password: 'password123',
      };

      // Act
      const response = await api.post(endpoint).send(inputData);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/email/);
    });

    test('Should return a new user', async () => {
      const inputData = {
        email: 'silgifredo@mail.com',
        password: 'password123',
      };

      const response = await api.post(endpoint).send(inputData);

      expect(response.statusCode).toBe(201);

      const user = await models.User.findByPk(response.body.id);
      expect(user).toBeTruthy();
      expect(user.email).toEqual(inputData.email);
    });
  });

  describe('PUT /users', () => {
    // tests for users
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
