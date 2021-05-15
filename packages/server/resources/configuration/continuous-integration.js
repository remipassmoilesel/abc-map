module.exports = {
  environmentName: 'test',
  externalUrl: 'http://localhost:10082/',
  server: {
    host: '127.0.0.1',
    port: 10_082,
    log: {
      requests: false,
      errors: true,
    },
    rateLimit: {
      max: 1000,
      timeWindow: '1m',
    },
  },
  database: {
    url: 'mongodb://mongo:27017',
    username: 'admin',
    password: 'admin',
  },
  authentication: {
    passwordSalt: 'azerty1234',
    jwtSecret: 'azerty1234',
    jwtAlgorithm: 'HS512',
    jwtExpiresIn: '45min',
  },
  registration: {
    confirmationSalt: 'azerty1234',
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
    enabledUsers: 50,
  },
};
