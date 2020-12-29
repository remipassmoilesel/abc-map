import * as logLevel from 'loglevel';
import { Logger as LogLevelLogger } from 'loglevel';

export declare type LogSeverity = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

export class Logger {
  /**
   * This method is the correct way to obtain a logger.
   */
  public static get(name: string, level: LogSeverity = 'warn'): Logger {
    const internalLogger = logLevel.getLogger(name);
    internalLogger.setLevel(level);
    return new Logger(name, internalLogger);
  }

  public static setGlobalLevel(level: LogSeverity): void {
    logLevel.setLevel(level);
    logLevel.setDefaultLevel(level);
  }

  private constructor(private name: string, private logger: LogLevelLogger) {}

  public disable(): void {
    this.logger.setLevel('silent');
  }

  public debug(message: string, data?: any): void {
    this.logger.debug(message, data || '');
  }

  public info(message: string, data?: any): void {
    this.logger.info(message, data || '');
  }

  public warn(message: string, data?: any): void {
    this.logger.warn(message, data || '');
  }

  public error(message: string, data?: any): void {
    this.logger.error(message, data || '');
  }
}
