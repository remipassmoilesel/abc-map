import { getAbcWindow } from '@abc-map/shared';
import { newTestServices, TestServices } from './TestServices';
import { getServices } from '../../Services';

/**
 * This function mocks the main service map, which is returned by getServices().
 *
 * Generally, you should prefer create your own test service map and inject it.
 *
 * If injection is not possible everywhere, use this function.
 *
 * Don't forget to call restoreServices() after for the next tests.
 *
 */
export function mockServices(): TestServices {
  const window = getAbcWindow();
  window.abc.services = newTestServices();
  return window.abc.services;
}

export function restoreServices() {
  const window = getAbcWindow();
  window.abc.services = undefined;
  return getServices();
}
