module.exports = {
  environmentName: 'local',
  externalUrl: 'http://localhost:3005/',
  server: {
    host: '127.0.0.1',
    port: 10_082,
  },
  database: {
    url: 'mongodb://localhost:27019',
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
    users: 10,
    enabledUsers: 5,
  },
};
