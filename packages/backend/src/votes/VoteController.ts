import * as express from 'express';
import { Request, Response, Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { asyncHandler } from '../server/asyncHandler';
import { AbcVote } from '@abc-map/shared-entities';
import { DateTime } from 'luxon';

export class VoteController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/vote';
  }

  public getRouter(): Router {
    const app = express();
    app.post('/', asyncHandler(this.save));
    app.get('/:from/:to', asyncHandler(this.stats));
    return app;
  }

  public save = async (req: Request, res: Response): Promise<void> => {
    const vote: AbcVote | undefined = req.body;
    if (!vote || typeof vote.value === 'undefined') {
      return Promise.reject(new Error(`Invalid vote`));
    }

    await this.services.vote.save(vote, DateTime.now());
    res.status(200).send();
  };

  public stats = async (req: Request, res: Response): Promise<void> => {
    const from: string | undefined = req.params.from;
    const to: string | undefined = req.params.to;
    if (!from || !to) {
      return Promise.reject(new Error(`Invalid request`));
    }

    const fromDateTime = DateTime.fromISO(from).startOf('day');
    const toDateTime = DateTime.fromISO(to).endOf('day');
    const result = await this.services.vote.aggregate(fromDateTime, toDateTime);
    res.json(result);
  };
}
