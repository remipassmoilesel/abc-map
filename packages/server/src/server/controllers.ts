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

import type { Config } from '../config/Config.js';
import type { Services } from '../services/services.js';
import type { Controller } from './Controller.js';
import { MetricsController } from '../metrics/MetricsController.js';
import { HealthCheckController } from '../health/HealthCheckController.js';
import { AuthenticationController } from '../authentication/AuthenticationController.js';
import { ProjectController } from '../projects/ProjectController.js';
import { DataStoreController } from '../data-store/DataStoreController.js';
import { FeedbackController } from '../feedback/FeedbackController.js';
import { ProjectionController } from '../projections/ProjectionController.js';
import { WebappController } from './WebappController.js';
import { SitemapController } from './sitemap/SitemapController.js';
import { LegalMentionsController } from './LegalMentionsController.js';
import { DocumentationController } from '../documentation/DocumentationController.js';
import { LegacyRoutesRedirectionController } from './LegacyRoutesRedirectionController.js';
import { PointIconsController } from '../point-icons/PointIconsController.js';

/**
 * Routes exposed in these controllers are public and do not need a valid authentication
 * @param config
 * @param services
 */
export function publicControllers(config: Config, services: Services): Controller[] {
  return [
    new LegacyRoutesRedirectionController(),
    new SitemapController(config),
    new LegalMentionsController(config),
    new DocumentationController(config),
    new MetricsController(config, services),
    new HealthCheckController(services),
    new AuthenticationController(config, services),
    // Web app controller must be the last, it has a catch-all 404 handler
    new WebappController(config),
  ];
}

/**
 * Routes exposed in these controllers are private and need a valid authentication
 * @param config
 * @param services
 */
export function privateControllers(config: Config, services: Services): Controller[] {
  return [
    new ProjectController(config, services),
    new DataStoreController(services),
    new FeedbackController(config, services),
    new ProjectionController(services),
    new PointIconsController(services),
  ];
}
