export const ConfigInputSchema = {
  type: 'object',
  required: ['environmentName', 'externalUrl', 'database', 'authentication', 'registration', 'smtp', 'datastore'],
  additionalProperties: false,
  properties: {
    environmentName: { type: 'string' },
    externalUrl: { type: 'string' },
    server: {
      type: 'object',
      minProperties: 4,
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        log: {
          type: 'object',
          minProperties: 2,
          properties: {
            requests: { type: 'boolean' },
            errors: { type: 'boolean' },
          },
        },
        rateLimit: {
          type: 'object',
          minProperties: 2,
          properties: {
            max: { type: 'number' },
            timeWindow: { type: 'string' },
          },
        },
      },
    },
    database: {
      type: 'object',
      minProperties: 3,
      properties: {
        url: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
    authentication: {
      type: 'object',
      minProperties: 4,
      properties: {
        passwordSalt: { type: 'string' },
        jwtSecret: { type: 'string' },
        jwtAlgorithm: { type: 'string' },
        jwtExpiresIn: { type: 'string' },
      },
    },
    registration: {
      type: 'object',
      minProperties: 1,
      properties: {
        confirmationSalt: { type: 'string' },
      },
    },
    smtp: {
      type: 'object',
      minProperties: 3,
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        auth: {
          type: 'object',
          minProperties: 2,
          properties: {
            user: { type: 'string' },
            pass: { type: 'string' },
          },
        },
      },
    },
    datastore: {
      type: 'object',
      minProperties: 1,
      properties: {
        path: { type: 'string' },
      },
    },
    development: {
      type: 'object',
      minProperties: 3,
      properties: {
        enabled: { type: 'boolean' },
        users: { type: 'number' },
        enabledUsers: { type: 'number' },
      },
    },
  },
};
