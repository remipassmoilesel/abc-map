import { Logger } from './Logger';

const logger = Logger.get('Banners.ts', 'info');

export class Banners {
  public cli(): void {
    logger.info('🌍 Abc-CLI 🔨');
  }

  public done(): void {
    logger.info('Oh yeah 💪');
  }
}
