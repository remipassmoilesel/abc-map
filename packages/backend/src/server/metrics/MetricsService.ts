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

import { AbstractService } from '../../services/AbstractService';
import { Logger } from '../../utils/Logger';
import * as promClient from 'prom-client';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

const logger = Logger.get('MetricsService.ts');

collectDefaultMetrics();

export class MetricsService extends AbstractService {
  public static create(): MetricsService {
    return new MetricsService(promClient.register);
  }

  private failedAuth: Counter<string>;
  private auth: Counter<string>;

  constructor(private registry: Registry) {
    super();

    this.failedAuth = new Counter({
      name: 'abcmap_authentications_failed',
      help: 'Number of failed authentication',
    });
    this.auth = new Counter({
      name: 'abcmap_authentications_succeeded',
      help: 'Number of succeeded authentication',
    });
  }

  public getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  public authenticationFailed() {
    this.failedAuth.inc();
  }

  public authenticationSucceeded() {
    this.auth.inc();
  }
}
