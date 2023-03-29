const request = require('supertest');

const createApp = require('../src/app');

describe('Test for app', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeEach(() => {
    app = createApp();

    app.get('/hello', (_req, res) => {
      res.status(200).json({ name: 'Robinson' });
    });

    server = app.listen(3000);

    api = request(app);
  });

  describe('GET /users', () => {
    // tests for users
  });

  describe('POST /users', () => {
    test('Invalid password - Should return a 400 Bad request', async () => {
      // Arrange
      const inputData = {
        email: 'r@gmail.com',
        password: '-----',
      };

      // Act
      const response = await api.post('/api/v1/users').send(inputData);

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
      const response = await api.post('/api/v1/users').send(inputData);

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
