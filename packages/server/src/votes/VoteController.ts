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

import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { AbcVote } from '@abc-map/shared';
import { DateTime } from 'luxon';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatParams, VoteSchema } from './VoteController.schemas';

export class VoteController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/vote';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    // We restrict vote by ip
    const voteConfig = {
      rateLimit: {
        max: 10,
        timeWindow: '1h',
      },
    };

    app.post('/', { config: voteConfig, schema: VoteSchema }, this.vote);
    app.get('/statistics/:from/:to', this.stats);
  };

  private vote = async (req: FastifyRequest<{ Body: AbcVote }>, reply: FastifyReply): Promise<void> => {
    await this.services.vote.save(req.body, DateTime.now());
    reply.status(200).send();
  };

  private stats = async (req: FastifyRequest<{ Params: StatParams }>, reply: FastifyReply): Promise<void> => {
    const from = req.params.from;
    const to = req.params.to;
    if (!from || !to) {
      return Promise.reject(new Error(`Invalid request`));
    }

    const fromDateTime = DateTime.fromISO(from).startOf('day');
    const toDateTime = DateTime.fromISO(to).endOf('day');
    const result = await this.services.vote.aggregate(fromDateTime, toDateTime);
    reply.send(result);
  };
}
