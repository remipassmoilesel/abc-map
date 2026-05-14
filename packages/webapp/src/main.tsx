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
import { getServices } from './core/Services';
import { Logger } from '@abc-map/shared';
import { mainStore } from './store/store';
import { bootstrap } from './bootstrap';
import { reportWebVitals } from './core/utils/reportWebVitals.ts';
import { VERSION } from './version.ts';

// Create global references to entities
import './core/globals';

// Load main style
import './main.scss';

// Load translations
import './i18n/i18n';

const logger = Logger.get('index.tsx', 'info');

logger.info(`Starting Abc-Map version: ${JSON.stringify(VERSION)}`);

// Start application
const svc = getServices();
bootstrap(svc, mainStore).catch((err) => logger.error('Bootstrap fail: ', err));

svc.pwa.initServiceWorker();

const ReportWebVitals = false;
if (ReportWebVitals) {
  reportWebVitals(function (...args: unknown[]) {
    logger.info('Performance analysis: ', args);
  });
}
