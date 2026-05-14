/**
 * Copyright © 2026 Rémi Pace.
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

import type { BeforeInstallPromptEvent } from './BeforeInstallPromptEvent';
import { isE2eTests, Logger } from '@abc-map/shared';
import { isProductionBuild } from '../utils/isProductionBuild.ts';
import { registerSW } from 'virtual:pwa-register';
import type { MainStore } from '../../store/store.ts';
import { UiActions } from '../../store/ui/actions.ts';

const logger = Logger.get('PwaService.ts', 'info');

export class PwaService {
  private online = navigator.onLine ?? true;
  private beforeInstallPromptEvent?: BeforeInstallPromptEvent;

  constructor(private store: MainStore) {
    window.addEventListener('offline', () => (this.online = false));
    window.addEventListener('online', () => (this.online = true));
    window.addEventListener('beforeinstallprompt', (ev) => {
      this.beforeInstallPromptEvent = ev as BeforeInstallPromptEvent;
    });
  }

  public initServiceWorker() {
    // We register service worker
    const enableServiceWorker = isProductionBuild() || isE2eTests();
    if (enableServiceWorker) {
      logger.info('Service worker is enabled, registering.');
      registerSW({
        immediate: false,
        onRegisteredSW: () => {
          logger.info('Service worker has been registered (onRegisteredSW)');
          this.store.dispatch(UiActions.setServiceWorkerState({ installed: true }));
        },
        onNeedRefresh: () => {
          logger.info('Application refresh needed (onNeedRefresh)');
          this.store.dispatch(UiActions.setServiceWorkerState({ updateAvailable: true }));
        },
        onOfflineReady: () => {
          logger.info('Offline ready (onOfflineReady)');
        },
        onRegisterError: (err) => {
          logger.info('Service worker registration error (onRegisterError)', err);
          this.store.dispatch(UiActions.setServiceWorkerState({ error: true }));
        },
      });
    } else {
      logger.info('Service worker is disabled.');
    }
  }

  public async install(): Promise<boolean> {
    if (!this.beforeInstallPromptEvent) {
      throw new Error('Not initialized');
    }

    return this.beforeInstallPromptEvent.prompt().then((res) => res.outcome === 'accepted');
  }

  public isInstallationReady(): boolean {
    return !!this.beforeInstallPromptEvent;
  }

  // Return true if client has access to the network
  public isOnline(): boolean {
    return this.online;
  }
}
