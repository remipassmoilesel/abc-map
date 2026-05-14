/*
 * Copyright © 2026 Rémi Pace.
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

import type { RefinedResponse, ResponseType } from 'k6/http';
import http from 'k6/http';
import type { AbcProjectMetadata, AuthenticationResponse } from '@abc-map/shared';
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

export function extractAuthentication(body: string | ArrayBuffer | null): HeaderMap {
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

export function assertStatusCode(code: number) {
  return (res: { status: number | undefined }) => {
    if (res.status !== code) {
      console.error('Invalid status code: ', { expected: code, actual: res.status });
    }

    return res.status === code;
  };
}

export function assertMinBodyLength(length: number) {
  return (res: { body: string | unknown }) => {
    if (!res.body || typeof res.body !== 'string') {
      console.error(`Unexpected response body received: ${typeof res.body}`);
      return false;
    }

    return res.body.length > length;
  };
}
