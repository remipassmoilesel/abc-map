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

import { BeforeInstallPromptEvent } from './BeforeInstallPromptEvent';
import { LocalStorageService, StorageKey } from '../local-storage/LocalStorageService';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('PwaService.ts');

export class PwaService {
  private online = navigator.onLine ?? true;
  private beforeInstallPromptEvent?: BeforeInstallPromptEvent;

  constructor(private storage: LocalStorageService) {
    window.addEventListener('offline', () => (this.online = false));
    window.addEventListener('online', () => (this.online = true));
    window.addEventListener('beforeinstallprompt', (ev) => {
      this.beforeInstallPromptEvent = ev as BeforeInstallPromptEvent;
    });
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

  public isOnline(): boolean {
    return this.online;
  }

  public isDevWorkerEnabled() {
    return this.storage.get(StorageKey.DEV_SERVICE_WORKER) === 'true';
  }

  public setDevWorkerEnabled(enabled: boolean) {
    this.storage.set(StorageKey.DEV_SERVICE_WORKER, JSON.stringify(enabled));
    window.location.reload();
  }
}
