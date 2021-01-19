import { Logger } from './Logger';

const logger = Logger.get('Banners.ts', 'info');

export class Banners {
  public cli(): void {
    logger.info('🌍 Abc-CLI 🔨');
  }

  public done(): void {
    logger.info('Oh yeah 💪');
  }

  public big(): void {
    logger.info(`

  /$$$$$$  /$$                         /$$$$$$  /$$       /$$$$$$
 /$$__  $$| $$                        /$$__  $$| $$      |_  $$_/
| $$  \\ $$| $$$$$$$   /$$$$$$$       | $$  \\__/| $$        | $$
| $$$$$$$$| $$__  $$ /$$_____//$$$$$$| $$      | $$        | $$
| $$__  $$| $$  \\ $$| $$     |______/| $$      | $$        | $$
| $$  | $$| $$  | $$| $$             | $$    $$| $$        | $$
| $$  | $$| $$$$$$$/|  $$$$$$$       |  $$$$$$/| $$$$$$$$ /$$$$$$
|__/  |__/|_______/  \\_______/        \\______/ |________/|______/


    `);
  }
}
