const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('./../src/db/sequelize')

describe('tests for /profile path', () => {

  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe('GET /my-user with admin user', () => {

    beforeAll(async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: "admin123"
      };
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send(inputData);
      accessToken = bodyLogin.access_token;
    })

    test('should return 401', async () => {
      const { statusCode } = await api.get(`/api/v1/profile/my-user`).set({
        'Authorization': `Bearer 121212`
      });
      expect(statusCode).toEqual(401);
    });

    test('should return a user with access token valid', async () => {
      const user = await models.User.findByPk('1');
      const { statusCode, body } = await api.get(`/api/v1/profile/my-user`).set({
        'Authorization': `Bearer ${accessToken}`
      });
      expect(statusCode).toEqual(200);
      // check DB
      expect(body.email).toEqual(user.email);
    });

    afterAll(() => {
      accessToken = null;
    })
  });

  describe('GET /my-orders', () => {
    test('should return 401', async () => {
      const { statusCode } = await api.get(`/api/v1/profile/my-orders`).set({
        'Authorization': `Bearer 121212`
      });
      expect(statusCode).toEqual(401);
    });
  });


  afterAll(() => {
    server.close();
  })
});

