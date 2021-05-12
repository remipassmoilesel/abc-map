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
import { AbcVote, AbcVoteAggregation, VoteValue } from '@abc-map/shared-entities';
import { AbstractService } from '../services/AbstractService';
import { VoteDocument } from './VoteDocument';
import * as uuid from 'uuid-random';
import { DateTime } from 'luxon';

const authorizedValues = [VoteValue.NOT_SATISFIED, VoteValue.BLAH, VoteValue.SATISFIED];

export class VoteService extends AbstractService {
  public static create(client: MongodbClient): VoteService {
    return new VoteService(new VoteDao(client));
  }

  constructor(private dao: VoteDao) {
    super();
  }

  public async init(): Promise<void> {
    return this.dao.init();
  }

  public async save(vote: AbcVote, date: DateTime): Promise<void> {
    if (authorizedValues.indexOf(vote.value) === -1) {
      return Promise.reject(new Error(`Invalid value: ${vote.value}`));
    }

    const doc: VoteDocument = {
      _id: uuid(),
      value: vote.value,
      date: date.toJSDate(),
    };

    return this.dao.save(doc);
  }

  public async aggregate(start: DateTime, end: DateTime): Promise<AbcVoteAggregation> {
    const agg = await this.dao.aggregate(start.toJSDate(), end.toJSDate());

    const notSatisfied = agg.find((v) => v.value === VoteValue.NOT_SATISFIED)?.count || 0;
    const blah = agg.find((v) => v.value === VoteValue.BLAH)?.count || 0;
    const satisfied = agg.find((v) => v.value === VoteValue.SATISFIED)?.count || 0;
    const total = notSatisfied + blah + satisfied;

    return {
      notSatisfied: Math.round((notSatisfied * 100) / total) || 0,
      blah: Math.round((blah * 100) / total) || 0,
      satisfied: Math.round((satisfied * 100) / total) || 0,
      start: start.toISODate(),
      end: end.toISODate(),
      total,
    };
  }
}
