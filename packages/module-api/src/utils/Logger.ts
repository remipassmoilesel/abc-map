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

import * as logLevel from 'loglevel';
import { Logger as LogLevelLogger } from 'loglevel';

export declare type LogSeverity = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

export class Logger {
  /**
   * This method is the correct way to obtain a logger.
   * @param name The logger name, for example: UserService.ts
   * @param level The logger level, see LogSeverity
   */
  public static get(name: string, level: LogSeverity = 'warn'): Logger {
    const internalLogger = logLevel.getLogger(name);
    internalLogger.setLevel(level);
    return new Logger(name, internalLogger);
  }

  private constructor(private name: string, private logger: LogLevelLogger) {}

  public disable(): void {
    this.logger.setLevel('silent');
  }

  public debug(message: string | Error, data?: any): void {
    this.logger.debug(this.normalizeMessage(message), data || '');
  }

  public info(message: string | Error, data?: any): void {
    this.logger.info(this.normalizeMessage(message), data || '');
  }

  public warn(message: string | Error, data?: any): void {
    this.logger.warn(this.normalizeMessage(message), data || '');
  }

  public error(message: string | Error, data?: any): void {
    this.logger.error(this.normalizeMessage(message), data || '');
  }

  private normalizeMessage(message: string | Error): string {
    return `[${new Date().toISOString()}][${this.name}] ${message}`;
  }
}
