const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');

describe('Test for app', () => {
  const endpoint = '/api/v1/users';
  let app = null;
  let server = null;
  let api = null;

  beforeEach(() => {
    app = createApp();
    server = app.listen(3000);
    api = request(app);
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
  });

  describe('PUT /users', () => {
    // tests for users
  });

  afterEach(() => {
    server.close();
  });
});
