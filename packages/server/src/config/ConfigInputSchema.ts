export const ConfigInputSchema = {
  type: 'object',
  required: ['environmentName', 'externalUrl', 'database', 'jwt', 'authentication', 'registration', 'smtp', 'datastore'],
  additionalProperties: false,
  properties: {
    environmentName: { type: 'string' },
    externalUrl: { type: 'string' },
    server: {
      type: 'object',
      minProperties: 5,
      additionalProperties: false,
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        log: {
          type: 'object',
          minProperties: 2,
          additionalProperties: false,
          properties: {
            requests: { type: 'boolean' },
            errors: { type: 'boolean' },
          },
        },
        globalRateLimit: {
          type: 'object',
          minProperties: 2,
          additionalProperties: false,
          properties: {
            max: { type: 'number' },
            timeWindow: { type: 'string' },
          },
        },
        authenticationRateLimit: {
          type: 'object',
          minProperties: 2,
          additionalProperties: false,
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
      additionalProperties: false,
      properties: {
        url: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
    jwt: {
      type: 'object',
      minProperties: 1,
      additionalProperties: false,
      properties: {
        algorithm: { type: 'string' },
      },
    },
    authentication: {
      type: 'object',
      minProperties: 3,
      additionalProperties: false,
      properties: {
        secret: { type: 'string' },
        tokenExpiresIn: { type: 'string' },
        passwordLostExpiresIn: { type: 'string' },
      },
    },
    registration: {
      type: 'object',
      minProperties: 3,
      additionalProperties: false,
      properties: {
        passwordSalt: { type: 'string' },
        secret: { type: 'string' },
        confirmationExpiresIn: { type: 'string' },
      },
    },
    smtp: {
      type: 'object',
      minProperties: 3,
      additionalProperties: false,
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        auth: {
          type: 'object',
          minProperties: 2,
          additionalProperties: false,
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
      additionalProperties: false,
      properties: {
        path: { type: 'string' },
      },
    },
    development: {
      type: 'object',
      minProperties: 2,
      additionalProperties: false,
      properties: {
        enabled: { type: 'boolean' },
        users: { type: 'number' },
      },
    },
  },
};
