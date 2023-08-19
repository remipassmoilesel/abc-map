/*
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
 *
 *
 */

import { Counter, CounterConfiguration } from 'prom-client';

export const Prefix = 'abcmap';
export const CounterNames = {
  AuthenticationFailed: `${Prefix}_authentications_failed`,
  AnonymousAuthenticationSucceeded: `${Prefix}_anonymous_authentications_succeeded`,
  AuthenticationSucceeded: `${Prefix}_authentications_succeeded`,
  RegistrationError: `${Prefix}_registration_errors`,
  NewRegistration: `${Prefix}_new_registration`,
  RegistrationConfirmationFailed: `${Prefix}_registration_confirmation_failed`,
  RegistrationConfirmed: `${Prefix}_registration_confirmed`,
  RequestQuotaExceeded: `${Prefix}_request_quota_exceeded`,
  DatastoreList: `${Prefix}_datastore_display`,
  DatastoreSearch: `${Prefix}_datastore_search`,
  ResetPasswordEmail: `${Prefix}_reset_password_email`,
  ResetPassword: `${Prefix}_reset_password`,
  ProjectSaved: `${Prefix}_project_saved`,
  ProjectList: `${Prefix}_project_list`,
  ProjectFetch: `${Prefix}_project_fetch`,
  SharedProjectFetch: `${Prefix}_shared_project_fetch`,
  Vote: `${Prefix}_vote`,
  TextFeedback: `${Prefix}_text_feedback`,
};

export const Counters: { [k: string]: CounterConfiguration<string> } = {
  [CounterNames.AuthenticationFailed]: {
    name: CounterNames.AuthenticationFailed,
    help: 'Number of failed authentication',
  },
  [CounterNames.AnonymousAuthenticationSucceeded]: {
    name: CounterNames.AnonymousAuthenticationSucceeded,
    help: 'Number of succeeded anonymous authentications',
  },
  [CounterNames.AuthenticationSucceeded]: {
    name: CounterNames.AuthenticationSucceeded,
    help: 'Number of succeeded authentications',
  },
  [CounterNames.RegistrationError]: {
    name: CounterNames.RegistrationError,
    help: 'Errors on first call of registration',
  },
  [CounterNames.NewRegistration]: {
    name: CounterNames.NewRegistration,
    help: 'New request for registration, not confirmed',
  },
  [CounterNames.RegistrationConfirmationFailed]: {
    name: CounterNames.RegistrationConfirmationFailed,
    help: 'Errors on registration confirmation',
  },
  [CounterNames.RegistrationConfirmed]: {
    name: CounterNames.RegistrationConfirmed,
    help: 'Registration confirmed successfully',
  },
  [CounterNames.RequestQuotaExceeded]: {
    name: CounterNames.RequestQuotaExceeded,
    help: 'Number of requests out of standard quota',
  },
  [CounterNames.DatastoreList]: {
    name: CounterNames.DatastoreList,
    help: 'Number of data store display',
  },
  [CounterNames.DatastoreSearch]: {
    name: CounterNames.DatastoreSearch,
    help: 'Number of data store search',
  },
  [CounterNames.ResetPasswordEmail]: {
    name: CounterNames.ResetPasswordEmail,
    help: 'Number of password reset requests',
  },
  [CounterNames.ResetPassword]: {
    name: CounterNames.ResetPassword,
    help: 'Number of effective password reset',
  },
  [CounterNames.ProjectSaved]: {
    name: CounterNames.ProjectSaved,
    help: 'Number of project save requests',
  },
  [CounterNames.ProjectList]: {
    name: CounterNames.ProjectList,
    help: 'Number of project list requests',
  },
  [CounterNames.ProjectFetch]: {
    name: CounterNames.ProjectFetch,
    help: 'Number of project read requests',
  },
  [CounterNames.SharedProjectFetch]: {
    name: CounterNames.SharedProjectFetch,
    help: 'Number of shared project read requests',
  },
  [CounterNames.Vote]: {
    name: CounterNames.Vote,
    help: 'Number of vote requests',
  },
  [CounterNames.TextFeedback]: {
    name: CounterNames.TextFeedback,
    help: 'Number of text feedbacks requests',
  },
};

export declare type CounterMap = { [k: string]: Counter<string> | undefined };
