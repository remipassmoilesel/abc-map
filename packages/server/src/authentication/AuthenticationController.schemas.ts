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
import { FastifySchema } from 'fastify/types/schema';

export const RegistrationRequestSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'lang'],
    additionalProperties: false,
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      lang: { type: 'string' },
    },
  },
};

export const RegistrationConfirmationRequestSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['token'],
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
    },
  },
};

export const LoginRequestSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
};

export const UpdatePasswordRequestSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['previousPassword', 'newPassword'],
    additionalProperties: false,
    properties: {
      previousPassword: { type: 'string' },
      newPassword: { type: 'string' },
    },
  },
};

export const PasswordLostRequestSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'lang'],
    additionalProperties: false,
    properties: {
      email: { type: 'string' },
      lang: { type: 'string' },
    },
  },
};

export const ResetPasswordSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['token', 'password'],
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
      password: { type: 'string' },
    },
  },
};

export const DeleteAccountSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['password'],
    additionalProperties: false,
    properties: {
      password: { type: 'string' },
    },
  },
};
