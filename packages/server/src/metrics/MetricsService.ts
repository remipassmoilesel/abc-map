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

import { AbstractService } from '../services/AbstractService.js';
import { Logger } from '@abc-map/shared';
import { Counter } from 'prom-client';
import type { CounterMap } from './MetricsService.definitions.js';
import { CounterNames, Counters } from './MetricsService.definitions.js';
import type { PromClient } from './PromClient.js';
import { promClient } from './PromClient.js';

const logger = Logger.get('MetricsService.ts');

export function disableMetricsServiceLogs() {
  logger.disable();
}

export class MetricsService extends AbstractService {
  public static create(): MetricsService {
    return new MetricsService(promClient);
  }

  private counters: CounterMap = {};

  constructor(private client: PromClient) {
    super();
  }

  public async init() {
    this.client.collectDefaultMetrics({
      register: this.client.register,
    });

    this.counters = {};
    for (const name of Object.values(CounterNames)) {
      this.counters[name] = new Counter({
        name: Counters[name].name,
        help: Counters[name].help,
        registers: [this.client.register],
      });
    }
  }

  public async shutdown() {
    this.clearMetrics();
  }

  public clearMetrics() {
    this.client.register.clear();
  }

  public getClient() {
    return this.client;
  }

  public getMetrics(): Promise<string> {
    return this.client.register.metrics();
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

  public datastoreList() {
    this.counters[CounterNames.DatastoreList]?.inc();
  }

  public datastoreSearch() {
    this.counters[CounterNames.DatastoreSearch]?.inc();
  }

  public resetPasswordEmail() {
    this.counters[CounterNames.ResetPasswordEmail]?.inc();
  }

  public resetPassword() {
    this.counters[CounterNames.ResetPassword]?.inc();
  }

  public projectSaved() {
    this.counters[CounterNames.ProjectSaved]?.inc();
  }

  public projectList() {
    this.counters[CounterNames.ProjectList]?.inc();
  }

  public projectFetch() {
    this.counters[CounterNames.ProjectFetch]?.inc();
  }

  public sharedProjectFetch() {
    this.counters[CounterNames.SharedProjectFetch]?.inc();
  }

  public vote() {
    this.counters[CounterNames.Vote]?.inc();
  }

  public textFeedback() {
    this.counters[CounterNames.TextFeedback]?.inc();
  }
}
