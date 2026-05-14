/**
 * Copyright © 2026 Rémi Pace.
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

export default {
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
