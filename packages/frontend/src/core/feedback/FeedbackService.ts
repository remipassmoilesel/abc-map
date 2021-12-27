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

import { AxiosInstance } from 'axios';
import { FeedbackRoutes as Api } from '../http/ApiRoutes';
import { AbcTextFeedback, AbcVote, AbcVoteAggregation, VoteValue } from '@abc-map/shared';
import { DateTime } from 'luxon';
import { ToastService } from '../ui/ToastService';
import { getLang } from '../../i18n/i18n';

export class FeedbackService {
  constructor(private httpClient: AxiosInstance, private toasts: ToastService) {}

  public textFeedback(text: string): Promise<void> {
    const data: AbcTextFeedback = { text, lang: getLang() };
    return this.httpClient
      .post(Api.textFeedback(), data)
      .then(() => undefined)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public vote(value: VoteValue): Promise<void> {
    const data: AbcVote = { value };
    return this.httpClient
      .post(Api.vote(), data)
      .then(() => undefined)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public getStats(from: DateTime, to: DateTime): Promise<AbcVoteAggregation> {
    return this.httpClient
      .get<AbcVoteAggregation>(Api.stats(from, to))
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }
}
