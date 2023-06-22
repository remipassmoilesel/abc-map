import { Logger } from '@abc-map/shared';

const logger = Logger.get('useIsIframe.ts');

export function useIsIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (err) {
    logger.debug('Error: ', err);
    return true;
  }
}
