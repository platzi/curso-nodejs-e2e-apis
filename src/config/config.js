const env = process.env.NODE_ENV || 'dev';

const envs = {
  'dev': '.env',
  'e2e': '.env.e2e'
};

const options = {};

if (envs[env]) {
  options.path = envs[env];
}

require('dotenv').config(options);

const config = {
  env,
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpPassword: process.env.SMTP_PASSWORD,
}

console.log('CONFIG', config);

module.exports = { config };
