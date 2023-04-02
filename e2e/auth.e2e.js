const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { config } = require('../src/config/config');
const { upSeed, downSeed } = require('./utils/umzug');

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockImplementation(() => {
      return {
        sendMail: mockSendMail,
      };
    }),
  };
});

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

  describe('Post /recovery', () => {
    beforeAll(() => {
      mockSendMail.mockClear();
    });

    test('Should return a 401', async () => {
      const inputData = { email: 'emailfake@mail.com' };
      const response = await api.post(`${endpoint}/recovery`).send(inputData);
      expect(response.statusCode).toEqual(401);
    });

    test('Should send the email', async () => {
      const user = await models.User.findByPk(1);
      const inputData = { email: user.email };
      mockSendMail.mockResolvedValue(true);
      const response = await api.post(`${endpoint}/recovery`).send(inputData);
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toBeTruthy();
      expect(mockSendMail).toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    downSeed();
    server.close();
  });
});
