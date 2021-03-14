import { Request } from 'express';
import { AbcUser } from '@abc-map/shared-entities';

export class Authentication {
  public static from(req: Request): AbcUser | undefined {
    return (req.user as unknown) as AbcUser | undefined;
  }
}
