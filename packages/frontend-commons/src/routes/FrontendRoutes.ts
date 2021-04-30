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

import { routeReplace } from './routeReplace';

export class FrontendRoutes {
  public static landing(): string {
    return '/';
  }

  public static map(): string {
    return '/map';
  }

  public static dataStore(): string {
    return '/datastore';
  }

  public static layout(): string {
    return '/layout';
  }

  public static documentation(): string {
    return '/documentation';
  }

  public static confirmAccount(userId?: string) {
    return routeReplace('/confirm-account/:userId', { userId });
  }

  public static dataProcessing(moduleId?: string) {
    return routeReplace('/data-processing/:moduleId?', { moduleId });
  }
}

export interface ConfirmAccountParams {
  userId?: string;
}

export interface DataProcessingParams {
  moduleId?: string;
}
