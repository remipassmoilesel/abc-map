/*
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
 *
 *
 */

import * as path from 'path';

export class Config {
  public getProjectRoot(): string {
    return path.resolve(__dirname, '..', '..', '..', '..');
  }

  public getServerRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/server');
  }

  public getServerPublicRoot(): string {
    return path.resolve(this.getServerRoot(), 'public');
  }

  public getCliRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/abc-cli');
  }

  public getDevServicesRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/infrastructure/dev-services');
  }

  public getE2eRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/e2e-tests');
  }

  public getPerformanceTestsRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/performance-tests');
  }

  public getUserDocRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/user-documentation');
  }

  public getFrontendUrl(): string {
    return 'http://127.0.0.1:10082/';
  }

  public getBackendUrl(): string {
    return 'http://127.0.0.1:10082/api/health/';
  }

  public getChartRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/infrastructure/helm-chart/abc-map');
  }
}
