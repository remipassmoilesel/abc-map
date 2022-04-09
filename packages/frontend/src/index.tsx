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
import reportWebVitals from './reportWebVitals';
import { getServices } from './core/Services';
import { Logger } from '@abc-map/shared';
import { mainStore } from './core/store/store';
import { bootstrap } from './bootstrap';

// Create global references to entities
import './core/globals';

// Load main style
import './index.scss';

// Load translations
import './i18n/i18n';

export const logger = Logger.get('index.tsx');

// Start application
const svc = getServices();
bootstrap(svc, mainStore).catch((err) => logger.error('Bootstrap fail: ', err));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
