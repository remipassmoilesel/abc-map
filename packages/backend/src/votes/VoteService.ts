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
