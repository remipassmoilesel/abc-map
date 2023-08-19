/**
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
 */

import { DateTime } from 'luxon';

export class ProjectRoutes {
  public static saveProject(): string {
    return '/api/projects/';
  }

  public static listProject(): string {
    return '/api/projects/';
  }

  public static findById(id: string): string {
    return `/api/projects/${id}`;
  }

  public static findSharedById(id: string): string {
    return `/api/projects/shared/${id}`;
  }

  public static delete(id: string): string {
    return `/api/projects/${id}`;
  }

  public static quotas(): string {
    return `/api/projects/quotas`;
  }
}

export class AuthenticationRoutes {
  public static authentication(): string {
    return '/api/authentication';
  }

  public static token(): string {
    return '/api/authentication/token';
  }

  public static password(): string {
    return '/api/authentication/password';
  }

  public static passwordResetEmail(): string {
    return '/api/authentication/password/reset-email';
  }

  public static account(): string {
    return '/api/authentication/account';
  }

  public static accountConfirmation(): string {
    return '/api/authentication/account/confirmation';
  }
}

export class DatastoreRoutes {
  public static list(): string {
    return '/api/datastore/list';
  }

  public static search(): string {
    return `/api/datastore/search`;
  }

  public static download(path: string): string {
    return `/api/datastore/download/${path}`;
  }
}

export class FeedbackRoutes {
  public static textFeedback(): string {
    return '/api/feedback/text';
  }

  public static vote(): string {
    return '/api/feedback/vote';
  }

  public static stats(from: DateTime, to: DateTime): string {
    return `/api/feedback/vote/statistics/${from.toISODate()}/${to.toISODate()}`;
  }
}

export class LegalMentionsRoutes {
  public static legalMentions(): string {
    return '/legal-mentions.html';
  }
}

export class ProjectionRoutes {
  public static findByCode(code: string): string {
    return `/api/projections/${code}`;
  }
}
