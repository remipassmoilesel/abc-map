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
import { Language } from '../../lang';

export class FrontendRoutes {
  constructor(private lang: Language | (() => Language)) {}

  public landing() {
    return new Route<EmptyParams>('/:lang', this.lang);
  }

  public map() {
    return new Route<EmptyParams>('/:lang/map', this.lang);
  }

  public dataStore() {
    return new Route<EmptyParams>('/:lang/datastore', this.lang);
  }

  public export() {
    return new Route<EmptyParams>('/:lang/export', this.lang);
  }

  public shareSettings() {
    return new Route<EmptyParams>('/:lang/share/settings', this.lang);
  }

  public sharedMap() {
    return new Route<SharedMapParams>('/:lang/shared-map/:projectId', this.lang);
  }

  public mapLegend() {
    return new Route<LegendParams>('/:lang/legend/:id', this.lang);
  }

  public documentation() {
    return new Route<EmptyParams>('/:lang/documentation', this.lang);
  }

  public dataProcessing() {
    return new Route<DataProcessingParams>('/:lang/data-processing/:moduleId?', this.lang);
  }

  public confirmAccount() {
    return new Route<ConfirmAccountParams>('/:lang/confirm-account/:token', this.lang);
  }

  public resetPassword() {
    return new Route<ResetPasswordParams>('/:lang/reset-password/:token', this.lang);
  }

  public userAccount() {
    return new Route<EmptyParams>('/:lang/user-profile', this.lang);
  }

  public legalMentions() {
    return new Route<EmptyParams>('/:lang/legal-mentions', this.lang);
  }

  public funding() {
    return new Route<EmptyParams>('/:lang/funding', this.lang);
  }

  public getAll(): Route<any>[] {
    return [
      this.landing(),
      this.map(),
      this.dataStore(),
      this.export(),
      this.shareSettings(),
      this.sharedMap(),
      this.mapLegend(),
      this.documentation(),
      this.dataProcessing(),
      this.confirmAccount(),
      this.resetPassword(),
      this.userAccount(),
      this.legalMentions(),
      this.funding(),
    ];
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

export interface SharedMapParams extends Params {
  projectId?: string;
}

export interface LegendParams extends Params {
  id?: string;
}
