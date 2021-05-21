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
export const STAGING_ENVIRONMENT = 'staging';

/**
 * This config is supplied by users
 */
export interface ConfigInput {
  environmentName: string;
  development?: DevelopmentDataConfig;
  externalUrl: string;
  server: ServerConfig;
  project: ProjectConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  authentication: AuthenticationConfig;
  registration: RegistrationConfig;
  smtp: SmtpConfig;
  datastore: DatastoreConfig;
}

/**
 * This config is used in application
 */
export interface Config extends ConfigInput {
  frontendPath: string;
}

export interface DevelopmentDataConfig {
  enabled: boolean;
  users: number;
}

export interface ServerConfig {
  host: string;
  port: number;
  log: {
    requests: boolean;
    errors: boolean;
  };
  globalRateLimit: {
    max: number;
    timeWindow: string;
  };
  authenticationRateLimit: {
    max: number;
    timeWindow: string;
  };
}

export interface ProjectConfig {
  maxPerUser: number;
}

export interface DatabaseConfig {
  url: string;
  databaseName?: string;
  username: string;
  password: string;
}

export interface JwtConfig {
  algorithm: Algorithm;
}

export interface AuthenticationConfig {
  secret: string;
  tokenExpiresIn: '45min';
  passwordLostExpiresIn: string;
}

export interface RegistrationConfig {
  passwordSalt: string;
  secret: string;
  confirmationExpiresIn: string;
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
