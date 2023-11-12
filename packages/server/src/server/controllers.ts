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

import { Config } from '../config/Config';
import { Services } from '../services/services';
import { Controller } from './Controller';
import { MetricsController } from '../metrics/MetricsController';
import { HealthCheckController } from '../health/HealthCheckController';
import { AuthenticationController } from '../authentication/AuthenticationController';
import { ProjectController } from '../projects/ProjectController';
import { DataStoreController } from '../data-store/DataStoreController';
import { FeedbackController } from '../feedback/FeedbackController';
import { ProjectionController } from '../projections/ProjectionController';
import { WebappController } from './WebappController';
import { SitemapController } from './sitemap/SitemapController';
import { LegalMentionsController } from './LegalMentionsController';
import { DocumentationController } from '../documentation/DocumentationController';
import { LegacyRoutesRedirectionController } from './LegacyRoutesRedirectionController';
import { PointIconsController } from '../point-icons/PointIconsController';

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
    new MetricsController(services),
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
