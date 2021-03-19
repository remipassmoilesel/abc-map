import { Response } from 'express';

export class HttpResponse {
  public static badRequest(res: Response, message: string): void {
    res.status(400).send({ status: 'bad request', message });
  }

  public static forbidden(res: Response): void {
    res.status(403).send({ status: 'forbidden' });
  }
}
