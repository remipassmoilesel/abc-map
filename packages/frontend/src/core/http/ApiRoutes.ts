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

import { DateTime } from 'luxon';

export class ProjectRoutes {
  public static saveProject(): string {
    return '/projects/';
  }

  public static listProject(): string {
    return '/projects/';
  }

  public static findById(id: string): string {
    return `/projects/${id}`;
  }

  public static findSharedById(id: string): string {
    return `/projects/shared/${id}`;
  }

  public static delete(id: string): string {
    return `/projects/${id}`;
  }
}

export class AuthenticationRoutes {
  public static authentication(): string {
    return '/authentication';
  }

  public static token(): string {
    return '/authentication/token';
  }

  public static password(): string {
    return '/authentication/password';
  }

  public static passwordResetEmail(): string {
    return '/authentication/password/reset-email';
  }

  public static account(): string {
    return '/authentication/account';
  }

  public static accountConfirmation(): string {
    return '/authentication/account/confirmation';
  }
}

export class DatastoreRoutes {
  public static list(): string {
    return '/datastore/list';
  }

  public static search(): string {
    return `/datastore/search`;
  }

  public static download(path: string): string {
    return `/datastore/download/${path}`;
  }
}

export class FeedbackRoutes {
  public static textFeedback(): string {
    return '/feedback/text';
  }

  public static vote(): string {
    return '/feedback/vote';
  }

  public static stats(from: DateTime, to: DateTime): string {
    return `/feedback/vote/statistics/${from.toISODate()}/${to.toISODate()}`;
  }
}

export class LegalMentionsRoutes {
  public static legalMentions(): string {
    return '/legal-mentions';
  }
}

export class ProjectionRoutes {
  public static findByCode(code: string): string {
    return `/projections/${code}`;
  }
}
