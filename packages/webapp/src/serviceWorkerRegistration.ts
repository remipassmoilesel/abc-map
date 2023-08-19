/**
 * Copyright © 2023 Rémi Pace.
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

import { getAbcWindow, Logger } from '@abc-map/shared';
import { getServices } from './core/Services';

const logger = Logger.get('serviceWorkerRegistration.ts', 'info');

type Config = {
  onSwInstalled?: (registration: ServiceWorkerRegistration) => void;
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void;
  onError?: (err: Error) => void;
};

const window = getAbcWindow();

export function serviceWorkerRegistration(config?: Config) {
  const { pwa } = getServices();

  // If service workers are not supported we do not try to enable one
  if (!('serviceWorker' in navigator)) {
    logger.info('Service workers are not supported.');
    config?.onError && config.onError(new Error('Service workers not supported'));
    return;
  }

  // If we are on localhost we disable service worker by default
  if (isDevelopmentWorkerEnv() && !pwa.isDevWorkerEnabled()) {
    logger.info('Service worker is disabled on localhost by default. You can enable it in experimental features dialog.');
    // We clean up previous worker
    unregister();
    return;
  }

  if (isDevelopmentWorkerEnv()) {
    logger.warn(`Service worker is enabled, you may experiment reload troubles. You can disable it in experimental features dialog.`);
  }

  const loadWorker = async () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    // Log when worker is loaded
    navigator.serviceWorker.ready.then(() => logger.info(`Service worker loaded.`)).catch((err) => logger.error('Service worker loading failed: ', err));

    // Watch for registration states
    // See: https://web.dev/service-worker-lifecycle/#handling-updates
    const registration = await navigator.serviceWorker.register(swUrl);
    registration.onupdatefound = () => {
      const newWorker = registration.installing;
      if (newWorker === null) {
        return;
      }

      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // At this point, the updated precached content has been fetched,
            // but the previous service worker will still serve the older
            // content until all client tabs are closed.
            logger.info('New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA.');

            // Execute callback
            if (config?.onUpdateAvailable) {
              config.onUpdateAvailable(registration);
            }
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a "Content is cached for offline use." message.
            logger.info('Content is cached for offline use.');

            // Execute callback
            if (config?.onSwInstalled) {
              config.onSwInstalled(registration);
            }
          }
        }
      };
    };
  };

  window.addEventListener('load', () => {
    loadWorker().catch((err) => logger.error('Worker loading error: ', err));
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => registration.unregister()).catch((error) => logger.error(error.message));
  }
}

export function isDevelopmentWorkerEnv(): boolean {
  const hostname = window.location.hostname;
  return Boolean(hostname === 'localhost' || hostname === '[::1]' || hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
}
