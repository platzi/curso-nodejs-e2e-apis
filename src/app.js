const express = require('express');
const cors = require('cors');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.handler');

const createApp = () => {
  const app = express();

  app.use(express.json());

  const whitelist = ['http://localhost:8080', 'https://myapp.co'];
  const options = {
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('no permitido'));
      }
    }
  }
  app.use(cors(options));

  require('./utils/auth');

  app.get('/', (req, res) => {
    res.send('Hola mi server en express');
  });

  app.get('/nueva-ruta', checkApiKey, (req, res) => {
    res.send('Hola, soy una nueva ruta');
  });

  app.get('/hello', (req, res) => {
    res.status(200).json({name: 'nico'});
  });

  routerApi(app);

  app.use(logErrors);
  app.use(ormErrorHandler);
  app.use(boomErrorHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
