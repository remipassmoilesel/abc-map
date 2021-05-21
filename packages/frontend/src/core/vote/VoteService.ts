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

import { Logger } from '@abc-map/shared';
import { AxiosInstance } from 'axios';
import { VoteRoutes as Api } from '../http/ApiRoutes';
import { AbcVote, AbcVoteAggregation, VoteValue } from '@abc-map/shared';
import { DateTime } from 'luxon';
import { ToastService } from '../ui/ToastService';

export const logger = Logger.get('ProjectService.ts', 'info');

export class VoteService {
  constructor(private httpClient: AxiosInstance, private toasts: ToastService) {}

  public vote(value: VoteValue): Promise<void> {
    const data: AbcVote = { value };
    return this.httpClient
      .post(Api.vote(), data)
      .then(() => undefined)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }

  public getStats(from: DateTime, to: DateTime): Promise<AbcVoteAggregation> {
    return this.httpClient
      .get<AbcVoteAggregation>(Api.stats(from, to))
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }
}
