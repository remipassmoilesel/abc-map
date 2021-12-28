/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */
import { JSONSchemaType } from 'ajv';
import { ConfigInput } from './Config';

export const ConfigInputSchema: JSONSchemaType<ConfigInput> = {
  type: 'object',
  required: ['environmentName', 'externalUrl', 'server', 'project', 'database', 'jwt', 'authentication', 'registration', 'smtp', 'datastore', 'legalMentions'],
  additionalProperties: false,
  properties: {
    environmentName: { type: 'string' },
    externalUrl: { type: 'string' },
    server: {
      type: 'object',
      required: ['host', 'port', 'log', 'globalRateLimit', 'authenticationRateLimit'],
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        log: {
          type: 'object',
          required: ['requests', 'errors'],
          properties: {
            requests: { type: 'boolean' },
            errors: { type: 'boolean' },
          },
        },
        globalRateLimit: {
          type: 'object',
          required: ['max', 'timeWindow'],
          properties: {
            max: { type: 'number' },
            timeWindow: { type: 'string' },
          },
        },
        authenticationRateLimit: {
          type: 'object',
          required: ['max', 'timeWindow'],
          properties: {
            max: { type: 'number' },
            timeWindow: { type: 'string' },
          },
        },
      },
    },
    project: {
      type: 'object',
      required: ['maxPerUser'],
      properties: {
        maxPerUser: { type: 'number' },
      },
    },
    database: {
      type: 'object',
      required: ['url', 'username', 'password'],
      properties: {
        url: { type: 'string' },
        databaseName: { type: 'string', nullable: true },
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
    jwt: {
      type: 'object',
      required: ['algorithm'],
      properties: {
        algorithm: { type: 'string' },
      },
    },
    authentication: {
      type: 'object',
      required: ['secret', 'tokenExpiresIn', 'passwordLostExpiresIn'],
      properties: {
        secret: { type: 'string' },
        tokenExpiresIn: { type: 'string' },
        passwordLostExpiresIn: { type: 'string' },
      },
    },
    registration: {
      type: 'object',
      required: ['passwordSalt', 'secret', 'confirmationExpiresIn'],
      properties: {
        passwordSalt: { type: 'string' },
        secret: { type: 'string' },
        confirmationExpiresIn: { type: 'string' },
      },
    },
    smtp: {
      type: 'object',
      required: ['from', 'host', 'port'],
      additionalProperties: false,
      properties: {
        from: { type: 'string' },
        host: { type: 'string' },
        port: { type: 'number' },
        auth: {
          type: 'object',
          required: [],
          nullable: true,
          properties: {
            user: { type: 'string' },
            pass: { type: 'string' },
          },
        },
      },
    },
    datastore: {
      type: 'object',
      required: ['path'],
      properties: {
        path: { type: 'string' },
      },
    },
    development: {
      type: 'object',
      required: ['generateData', 'users', 'persistEmails'],
      nullable: true,
      properties: {
        generateData: { type: 'boolean' },
        users: { type: 'number' },
        persistEmails: { type: 'boolean' },
      },
    },
    legalMentions: {
      type: 'string',
    },
  },
};
