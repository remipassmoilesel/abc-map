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

import { VoteDao } from './VoteDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { AbcTextFeedback, AbcVote, AbcVoteAggregation, VoteValue } from '@abc-map/shared';
import { AbstractService } from '../services/AbstractService';
import { VoteDocument } from './VoteDocument';
import * as uuid from 'uuid-random';
import { DateTime } from 'luxon';
import { TextFeedbackDocument } from './TextFeedbackDocument';
import { TextFeedbackDao } from './TextFeedbackDao';

const authorizedValues = [VoteValue.NOT_SATISFIED, VoteValue.BLAH, VoteValue.SATISFIED];

export class FeedbackService extends AbstractService {
  public static create(client: MongodbClient): FeedbackService {
    return new FeedbackService(new VoteDao(client), new TextFeedbackDao(client));
  }

  constructor(private voteDao: VoteDao, private feedbackDao: TextFeedbackDao) {
    super();
  }

  public async init(): Promise<void> {
    return this.voteDao.init();
  }

  public async textFeedback(feedback: AbcTextFeedback, date: DateTime): Promise<void> {
    const doc: TextFeedbackDocument = {
      _id: uuid(),
      text: feedback.text,
      lang: feedback.lang,
      when: date.toJSDate(),
    };

    await this.feedbackDao.save(doc);
  }

  public async vote(vote: AbcVote, date: DateTime): Promise<void> {
    if (authorizedValues.indexOf(vote.value) === -1) {
      return Promise.reject(new Error(`Invalid value: ${vote.value}`));
    }

    const doc: VoteDocument = {
      _id: uuid(),
      value: vote.value,
      date: date.toJSDate(),
    };

    await this.voteDao.save(doc);
  }

  public async aggregate(start: DateTime, end: DateTime): Promise<AbcVoteAggregation> {
    const agg = await this.voteDao.aggregate(start.toJSDate(), end.toJSDate());

    const notSatisfied = agg.find((v) => v.value === VoteValue.NOT_SATISFIED)?.count || 0;
    const blah = agg.find((v) => v.value === VoteValue.BLAH)?.count || 0;
    const satisfied = agg.find((v) => v.value === VoteValue.SATISFIED)?.count || 0;
    const total = notSatisfied + blah + satisfied;

    const startIso = start.toISODate();
    if (!startIso) {
      throw new Error('Invalid start: ' + start);
    }

    const endIso = end.toISODate();
    if (!endIso) {
      throw new Error('Invalid end: ' + end);
    }

    return {
      notSatisfied: Math.round((notSatisfied * 100) / total) || 0,
      blah: Math.round((blah * 100) / total) || 0,
      satisfied: Math.round((satisfied * 100) / total) || 0,
      start: startIso,
      end: endIso,
      total,
    };
  }
}
