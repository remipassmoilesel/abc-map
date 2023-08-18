/*
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
 *
 *
 */

import http, { RefinedResponse, ResponseType } from 'k6/http';
import { AbcProjectMetadata, AuthenticationResponse } from '@abc-map/shared';
import { bytes } from 'k6';
import uuid from 'uuid-random';

export declare type HeaderMap = { [name: string]: string };

export function jsonPost(route: string, body: any, headers?: HeaderMap): RefinedResponse<ResponseType | undefined> {
  return http.post(route, JSON.stringify(body), {
    headers: {
      ...jsonHeaders(),
      ...headers,
    },
  });
}

export function jsonGet(route: string, headers?: HeaderMap): RefinedResponse<ResponseType | undefined> {
  return http.get(route, {
    headers: {
      ...jsonHeaders(),
      ...headers,
    },
  });
}

export function get(route: string, headers?: HeaderMap): RefinedResponse<ResponseType | undefined> {
  return http.get(route, {
    headers: {
      ...headers,
    },
  });
}

export function authentication(token: string): { [k: string]: string } {
  return {
    Authorization: `Beader ${token}`,
  };
}

export function extractAuthentication(body: string | bytes | null): HeaderMap {
  if (typeof body !== 'string') {
    throw new Error('Invalid authentication response');
  }

  const authentication: AuthenticationResponse = JSON.parse(body);
  return {
    Authorization: `Bearer ${authentication.token}`,
  };
}

export function jsonHeaders(): HeaderMap {
  return {
    'Content-Type': 'application/json',
    accept: 'application/json',
  };
}

export function sampleProjectMetadata(): AbcProjectMetadata {
  const projectId = uuid();
  return {
    id: projectId,
    version: '0.0.1',
    name: `Test project ${projectId}`,
    public: false,
  };
}
