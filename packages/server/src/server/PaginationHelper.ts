import { FastifyRequest } from 'fastify';

export interface PaginatedQuery {
  limit?: string;
  offset?: string;
}

export class PaginationHelper {
  public static fromQuery(req: FastifyRequest<{ Querystring: PaginatedQuery }>): { limit: number; offset: number } {
    const limit = parseInt(req.query.limit || '10');
    const offset = parseInt(req.query.offset || '0');
    return { limit, offset };
  }
}
