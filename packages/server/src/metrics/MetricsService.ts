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

import { AbstractService } from '../services/AbstractService';
import { Logger } from '@abc-map/shared';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';
import { CounterMap, CounterNames, Counters } from './MetricsService.definitions';

const logger = Logger.get('MetricsService.ts');

export class MetricsService extends AbstractService {
  public static create(): MetricsService {
    const registry = new Registry();
    return new MetricsService(registry);
  }

  private counters: CounterMap;

  constructor(private registry: Registry) {
    super();

    collectDefaultMetrics({ register: registry });

    this.counters = {};
    for (const k of Object.values(CounterNames)) {
      this.counters[k] = new Counter({
        ...Counters[k],
        registers: [registry],
      });
    }
  }

  public getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  public authenticationFailed() {
    this.counters[CounterNames.AuthenticationFailed]?.inc();
  }

  public anonymousAuthenticationSucceeded() {
    this.counters[CounterNames.AnonymousAuthenticationSucceeded]?.inc();
  }

  public authenticationSucceeded() {
    this.counters[CounterNames.AuthenticationSucceeded]?.inc();
  }

  public registrationError() {
    this.counters[CounterNames.RegistrationError]?.inc();
  }

  public newRegistration() {
    this.counters[CounterNames.NewRegistration]?.inc();
  }

  public registrationConfirmationFailed() {
    this.counters[CounterNames.RegistrationConfirmationFailed]?.inc();
  }

  public registrationConfirmed() {
    this.counters[CounterNames.RegistrationConfirmed]?.inc();
  }

  public requestQuotaExceeded() {
    this.counters[CounterNames.RequestQuotaExceeded]?.inc();
  }
}
