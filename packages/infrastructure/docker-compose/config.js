module.exports = {
  environmentName: 'production',
  externalUrl: 'http://localhost:10082/',
  server: {
    host: '0.0.0.0',
    port: 10082,
    log: {
      requests: true,
      errors: true,
      warnings: false,
    },
    globalRateLimit: {
      max: 1000,
      timeWindow: '30m',
    },
    authenticationRateLimit: {
      max: 200,
      timeWindow: '30m',
    },
  },
  project: {
    maxPerUser: 10,
  },
  database: {
    url: 'mongodb://abc-mongodb:27017',
    username: 'CHANGEME',
    password: 'CHANGEME',
  },
  jwt: {
    algorithm: 'HS512',
  },
  authentication: {
    secret: 'CHANGEME',
    tokenExpiresIn: '7d',
    passwordLostExpiresIn: '30min',
  },
  registration: {
    passwordSalt: 'CHANGEME',
    secret: 'CHANGEME',
    confirmationExpiresIn: '24h',
  },
  smtp: {
    from: 'no-reply@abc-map.fr',
    host: 'abc-smtp',
    port: 25,
  },
  datastore: {
    path: '/srv/datastore',
  },
  legalMentions: `
            <div class="p-2">
                <h1>CHANGEME</h1>
            </div>
            `,
};
