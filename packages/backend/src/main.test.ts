import 'source-map-support/register';
import { ConfigLoader } from './config/ConfigLoader';
import { Logger } from './utils/Logger';

const logger = Logger.get('main.test.ts');

ConfigLoader.load().catch((err) => logger.error(err));
