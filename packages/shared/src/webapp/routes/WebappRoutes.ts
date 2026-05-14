/**
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
 */

import type { Params } from './Route.js';
import { Route } from './Route.js';
import type { Language } from '../../lang/index.js';

export class WebappRoutes {
  constructor(private lang: Language | (() => Language)) {}

  public landing() {
    return new Route('/:lang', this.lang);
  }

  public map() {
    return new Route('/:lang/map', this.lang);
  }

  public sharedMap() {
    return new Route<SharedMapParams>('/:lang/shared-map/:projectId', this.lang);
  }

  public confirmAccount() {
    // See ConfirmAccountTokenParam
    return new Route('/:lang/confirm-account', this.lang);
  }

  public resetPassword() {
    // See ResetPasswordTokenParam
    return new Route('/:lang/reset-password', this.lang);
  }

  public userAccount() {
    return new Route('/:lang/user-profile', this.lang);
  }

  public legalMentions() {
    return new Route('/:lang/legal-mentions', this.lang);
  }

  public funding() {
    return new Route('/:lang/funding', this.lang);
  }

  public changelog() {
    return new Route('/:lang/changelog', this.lang);
  }

  public moduleIndex() {
    return new Route('/:lang/modules', this.lang);
  }

  public module() {
    return new Route<ModuleParams>('/:lang/modules/:moduleId', this.lang);
  }

  public staticDocumentation() {
    return new Route('/documentation', this.lang);
  }

  public getMainRoutes(): Route<any>[] {
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
