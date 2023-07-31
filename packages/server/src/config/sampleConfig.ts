/**
 * Copyright © 2023 Rémi Pace.
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
 *
 *
 *
 */

import { ConfigInput } from './Config';

/**
 * This function return a valid javascript configuration example.
 */
export function sampleConfig(): string {
  const config: ConfigInput = {
    environmentName: 'local',
    externalUrl: 'http://localhost:10082/',
    server: {
      host: 'localhost',
      port: 10_082,
      log: {
        requests: true,
        errors: true,
        warnings: false,
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
    project: {
      maxPerUser: 10,
    },
    database: {
      url: 'mongodb://localhost:27019',
      username: 'admin',
      password: 'admin',
    },
    jwt: {
      algorithm: 'HS512',
    },
    authentication: {
      secret: 'azerty1234',
      tokenExpiresIn: '6h',
      passwordLostExpiresIn: '30min',
    },
    registration: {
      passwordSalt: 'azerty1234',
      secret: 'azerty1234',
      confirmationExpiresIn: '24h',
    },
    smtp: {
      from: 'no-reply@abc-map.fr',
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'lelia16@ethereal.email',
        pass: '63rntn3G4DU3uue2MJ',
      },
    },
    datastore: {
      path: 'resources/dev-datastore',
    },
    development: {
      generateData: {
        users: 100,
        projectsPerUser: 5,
      },
      persistEmails: true,
    },
    webapp: {
      appendToBody: '<div>Server templated content (webapp)</div>',
    },
    userDocumentation: {
      appendToBody: '<div>Server templated content (userDocumentation)</div>',
    },
    legalMentions: `<div>This platform is offered in order to be useful, but ....</div>`,
  };

  return `
module.exports = ${JSON.stringify(config, null, 2)}
`;
}
