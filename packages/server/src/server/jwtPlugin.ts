import fastifyJWT from 'fastify-jwt';
import { FastifyInstance } from 'fastify';
import { Config } from '../config/Config';

export function jwtPlugin(config: Config, app: FastifyInstance) {
  app.register(fastifyJWT, {
    secret: config.authentication.secret,
    sign: {
      algorithm: config.jwt.algorithm,
      expiresIn: config.authentication.tokenExpiresIn,
    },
  });
}
