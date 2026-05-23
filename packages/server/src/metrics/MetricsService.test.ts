/*
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
 *
 *
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { disableMetricsServiceLogs, MetricsService } from './MetricsService.js';
import { promClient } from './PromClient.js';

disableMetricsServiceLogs();

describe('MetricsService', () => {
  let service: MetricsService;

  beforeAll(async () => {
    service = new MetricsService(promClient);
    await service.init();
  });

  afterAll(async () => {
    await service.shutdown();
  });

  describe('getMetrics()', async () => {
    it('should return metrics', async () => {
      // Act
      service.anonymousAuthenticationSucceeded();
      service.anonymousAuthenticationSucceeded();
      service.anonymousAuthenticationSucceeded();

      service.authenticationFailed();
      service.authenticationFailed();
      service.authenticationFailed();
      service.authenticationFailed();
      service.authenticationFailed();

      // Assert
      const metrics = await service.getMetrics();
      expect(metrics).includes('abcmap_anonymous_authentications_succeeded 3');
      expect(metrics).includes('abcmap_authentications_failed 5');
    });
  });
});
