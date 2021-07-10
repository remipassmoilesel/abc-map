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

import { Params, Route } from './Route';

export class FrontendRoutes {
  public static landing() {
    return new Route<EmptyParams>('/');
  }

  public static map() {
    return new Route<EmptyParams>('/map');
  }

  public static dataStore() {
    return new Route<EmptyParams>('/datastore');
  }

  public static layout() {
    return new Route<EmptyParams>('/layout');
  }

  public static mapLegend() {
    return new Route<EmptyParams>('/layout/map-legend');
  }

  public static documentation() {
    return new Route<EmptyParams>('/documentation');
  }

  public static dataProcessing() {
    return new Route<DataProcessingParams>('/data-processing/:moduleId?');
  }

  public static confirmAccount() {
    return new Route<ConfirmAccountParams>('/confirm-account/:token');
  }

  public static resetPassword() {
    return new Route<ResetPasswordParams>('/reset-password/:token');
  }

  public static userAccount() {
    return new Route<EmptyParams>('/user-profile');
  }

  public static legalMentions() {
    return new Route<EmptyParams>('/legal-mentions');
  }

  public static funding() {
    return new Route<EmptyParams>('/funding');
  }
}

declare type EmptyParams = {};

export interface ConfirmAccountParams extends Params {
  token?: string;
}

export interface ResetPasswordParams extends Params {
  token?: string;
}

export interface DataProcessingParams extends Params {
  moduleId?: string;
}

export interface PasswordLostParams extends Params {
  token?: string;
}

export interface DataProcessingParams extends Params {
  moduleId?: string;
}
