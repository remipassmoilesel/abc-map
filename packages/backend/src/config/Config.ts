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

import { Algorithm } from 'jsonwebtoken';

export const LOCAL_ENVIRONMENT = 'local';
export const TEST_ENVIRONMENT = 'test';

export interface Config {
  environmentName: string;
  development?: boolean;
  externalUrl: string;
  frontendPath: string;
  server: ServerConfig;
  database: DatabaseConfig;
  authentication: AuthenticationConfig;
  registration: RegistrationConfig;
  smtp: SmtpConfig;
  datastore: DatastoreConfig;
}

export interface ServerConfig {
  host: string;
  port: number;
}

export interface DatabaseConfig {
  url: string;
  username: string;
  password: string;
}

export interface AuthenticationConfig {
  passwordSalt: string;
  jwtSecret: string;
  jwtAlgorithm: Algorithm;
  jwtExpiresIn: string;
}

export interface RegistrationConfig {
  confirmationSalt: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

export interface DatastoreConfig {
  path: string;
}
