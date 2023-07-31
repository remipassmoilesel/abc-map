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
import { AbcTextFeedback, AbcVote } from '@abc-map/shared';
import { DateTime } from 'luxon';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatParams, TextFeedbackSchema, VoteSchema } from './FeedbackController.schemas';
import { Config } from '../config/Config';
import { defaultRateLimitConfig } from '../server/helpers/defaultRateLimitConfig';

export class FeedbackController extends Controller {
  constructor(private config: Config, private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/api/feedback';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    const config = {
      // We restrict vote by ip
      rateLimit: { ...defaultRateLimitConfig(this.config), max: 30, timeWindow: '1h' },
    };

    app.post('/text', { config, schema: TextFeedbackSchema }, this.textFeedback);
    app.post('/vote', { config, schema: VoteSchema }, this.vote);
    app.get('/vote/statistics/:from/:to', this.stats);
  };

  private textFeedback = async (req: FastifyRequest<{ Body: AbcTextFeedback }>, reply: FastifyReply): Promise<void> => {
    const { feedback, metrics } = this.services;

    await feedback.textFeedback(req.body, DateTime.now());
    void reply.status(200).send();

    metrics.textFeedback();
  };

  private vote = async (req: FastifyRequest<{ Body: AbcVote }>, reply: FastifyReply): Promise<void> => {
    const { feedback, metrics } = this.services;

    await feedback.vote(req.body, DateTime.now());
    void reply.status(200).send();

    metrics.vote();
  };

  private stats = async (req: FastifyRequest<{ Params: StatParams }>, reply: FastifyReply): Promise<void> => {
    const from = req.params.from;
    const to = req.params.to;
    if (!from || !to) {
      return Promise.reject(new Error(`Invalid request`));
    }

    const fromDateTime = DateTime.fromISO(from).startOf('day');
    const toDateTime = DateTime.fromISO(to).endOf('day');
    const result = await this.services.feedback.aggregate(fromDateTime, toDateTime);
    void reply.send(result);
  };
}
