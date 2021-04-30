import { Logger } from '@abc-map/frontend-commons';
import { AxiosInstance } from 'axios';
import { VoteRoutes as Api } from '../http/ApiRoutes';
import { AbcVote, AbcVoteAggregation, VoteValue } from '@abc-map/shared-entities';
import { DateTime } from 'luxon';

export const logger = Logger.get('ProjectService.ts', 'info');

export class VoteService {
  constructor(private httpClient: AxiosInstance) {}

  public vote(value: VoteValue): Promise<void> {
    const data: AbcVote = { value };
    return this.httpClient.post(Api.vote(), data);
  }

  public getStats(from: DateTime, to: DateTime): Promise<AbcVoteAggregation> {
    return this.httpClient.get<AbcVoteAggregation>(Api.stats(from, to)).then((res) => res.data);
  }
}
