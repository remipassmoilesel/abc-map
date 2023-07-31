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

export class WebappRoutes {
  constructor(private lang: Language | (() => Language)) {}

  public landing() {
    return new Route<EmptyParams>('/:lang', this.lang);
  }

  public map() {
    return new Route<EmptyParams>('/:lang/map', this.lang);
  }

  public sharedMap() {
    return new Route<SharedMapParams>('/:lang/shared-map/:projectId', this.lang);
  }

  public confirmAccount() {
    // See ConfirmAccountTokenParam
    return new Route<EmptyParams>('/:lang/confirm-account', this.lang);
  }

  public resetPassword() {
    // See ResetPasswordTokenParam
    return new Route<EmptyParams>('/:lang/reset-password', this.lang);
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

  public changelog() {
    return new Route<EmptyParams>('/:lang/changelog', this.lang);
  }

  public moduleIndex() {
    return new Route<EmptyParams>('/:lang/modules', this.lang);
  }

  public module() {
    return new Route<ModuleParams>('/:lang/modules/:moduleId', this.lang);
  }

  public getAll(): Route<any>[] {
    return [
      this.landing(),
      this.map(),
      this.sharedMap(),
      this.confirmAccount(),
      this.resetPassword(),
      this.userAccount(),
      this.legalMentions(),
      this.funding(),
      this.changelog(),
      this.moduleIndex(),
    ];
  }
}

declare type EmptyParams = {};

export interface PasswordLostParams extends Params {
  token?: string;
}

export interface SharedMapParams extends Params {
  projectId?: string;
}

export interface ModuleParams extends Params {
  moduleId?: string;
}

// Search parameters used for account confirmation
export const ConfirmAccountTokenParam = 'token';

// Search parameters used for password reset
export const ResetPasswordTokenParam = 'token';
