module.exports = {
  environmentName: 'test',
  externalUrl: 'http://localhost:10082/',
  server: {
    host: '127.0.0.1',
    port: 10_082,
    log: {
      requests: false,
      errors: false,
    },
    globalRateLimit: {
      max: 1000,
      timeWindow: '1m',
    },
    authenticationRateLimit: {
      max: 1000,
      timeWindow: '1m',
    },
  },
  database: {
    url: 'mongodb://mongo:27017',
    username: 'admin',
    password: 'admin',
  },
  jwt: {
    algorithm: 'HS512',
  },
  authentication: {
    secret: 'azerty1234',
    tokenExpiresIn: '45min',
    passwordLostExpiresIn: '30min',
  },
  registration: {
    passwordSalt: 'azerty1234',
    secret: 'azerty1234',
    confirmationExpiresIn: '24h',
  },
  smtp: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'lelia16@ethereal.email',
      pass: '63rntn3G4DU3uue2MJ',
    },
  },
  datastore: {
    path: 'resources/datastore',
  },
  development: {
    enabled: true,
    users: 100,
  },
};
