import { Config } from '../config/Config';
import { Services } from '../services/services';
import { Controller } from './Controller';
import { MetricsController } from '../metrics/MetricsController';
import { HealthCheckController } from '../health/HealthCheckController';
import { AuthenticationController } from '../authentication/AuthenticationController';
import { ProjectController } from '../projects/ProjectController';
import { DataStoreController } from '../data-store/DataStoreController';
import { VoteController } from '../votes/VoteController';
import { ProjectionController } from '../projections/ProjectionController';

/**
 * Routes exposed in this controllers are public and do not need a valid authentication
 * @param config
 * @param services
 */
export function publicControllers(config: Config, services: Services): Controller[] {
  return [new MetricsController(services), new HealthCheckController(services), new AuthenticationController(config, services)];
}

/**
 * Routes exposed in this controllers are private and need a valid authentication
 * @param config
 * @param services
 */
export function privateControllers(config: Config, services: Services): Controller[] {
  return [new ProjectController(config, services), new DataStoreController(services), new VoteController(services), new ProjectionController(services)];
}
