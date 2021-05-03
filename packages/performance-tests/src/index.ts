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
import { Options } from 'k6/options';
import http, { batch, ObjectBatchRequest } from 'k6/http';
import { parseHTML } from 'k6/html';
import { check, sleep } from 'k6';
import { AuthenticationRequest } from '@abc-map/shared-entities';
import { extractAuthentication, jsonGet, jsonPost, sampleProjectMetadata } from './helpers';
import { FormData } from './FormDataPolyfill';

/*
 *
 * Default performance test for Abc-Map.
 *
 * This test fake a connected user. Maybe later we should have a test for anonymous users.
 *
 * Steps:
 * - First we fetch frontend
 * - We try to login with bad credentials
 * - We login with good credentials
 * - We list artefacts
 * - We search for artefacts
 * - We download two artefacts
 * - We save a project
 * - We list projects
 * - We download a project
 * - We delete a project
 *
 * TODO: Pass tests in CI, a light version (less VU)
 *
 */

const Root = 'http://192.168.1.12:10082';

const vus = 400;
export const options: Options = {
  vus,
  iterations: vus * 3,
};

// Simulate a project. This can cause memory issues, but shared array does not work as expected with binary files.
const fakeProject = open('../test-data/project.abm2', 'b');

export default () => {
  fetchFrontend();
  sleep(3);

  // We try to connect with bad credentials
  const badCredentials: AuthenticationRequest = { email: 'bad email', password: 'bad password' };
  const req1 = jsonPost(`${Root}/api/authentication/login`, badCredentials);
  check(req1, {
    'Bad authentication status is 403': (res) => res.status === 401,
  });

  // We login with correct credentials
  const goodCredentials: AuthenticationRequest = { email: 'user-' + __VU + '@abc-map.fr', password: 'azerty1234' };
  const req2 = jsonPost(`${Root}/api/authentication/login`, goodCredentials);
  const auth = extractAuthentication(req2.body);
  check(req2, {
    'Good authentication status is 200': (res) => res.status === 200,
  });

  sleep(3);

  // We list artefacts
  const req3 = jsonGet(`${Root}/api/datastore/list?limit=6&offset=0`, auth);
  check(req3, {
    'List artefacts status is 200': (res) => res.status === 200,
  });

  // We search artefacts
  const req4 = jsonGet(`${Root}/api/datastore/search?query=monde&limit=6&offset=0`, auth);
  check(req4, {
    'Search artefacts status is 200': (res) => res.status === 200,
  });

  // We download artefact 1
  const req5 = jsonGet(`${Root}/api/datastore/download/world/world-cities/world-cities.zip`, auth);
  check(req5, {
    'Download artefact 1 status is 200': (res) => res.status === 200,
    'Artefact 1 is heavy': (res) => (res.body?.length || 0) > 10_000,
  });

  // We download artefact 2
  const req6 = jsonGet(`${Root}/api/datastore/download/world/world-countries/world-countries.zip`, auth);
  check(req6, {
    'Download artefact 2 status is 200': (res) => res.status === 200,
    'Artefact 2 is heavy': (res) => (res.body?.length || 0) > 10_000,
  });

  sleep(3);

  // We save a project
  const formData = new FormData();
  const projectMetadata = sampleProjectMetadata();
  formData.append('metadata', JSON.stringify(projectMetadata));
  formData.append('project', http.file(fakeProject, 'project.abm2', 'application/zip'));

  const req7 = http.post(`${Root}/api/projects`, formData.body(), {
    headers: { ...auth, 'Content-Type': `multipart/form-data; boundary=${formData.boundary}` },
  });
  check(req7, {
    'Project save status is 200': (res) => res.status === 200,
  });

  sleep(3);

  // We list projects
  const req8 = jsonGet(`${Root}/api/projects`, auth);
  check(req8, {
    'List projects status is 200': (res) => res.status === 200,
  });

  // We download project
  const req9 = jsonGet(`${Root}/api/projects/${projectMetadata.id}`, auth);
  check(req9, {
    'Get project status is 200': (res) => res.status === 200,
    // FIXME: Test setup freeze if size exceed few kb, probably due to k6 memory usage and FormDataPolyfill.ts
    // 'Project is heavy': (res) => (res.body?.length || 0) > 100_000,
  });

  // We delete project
  const req10 = http.del(`${Root}/api/projects/${projectMetadata.id}`, undefined, { headers: auth });
  check(req10, {
    'Delete project status is 200': (res) => res.status === 200,
  });
};

function fetchFrontend() {
  // Fetch index.html
  const res = http.get(Root);
  if (!res.body || typeof res.body !== 'string') {
    throw new Error('Invalid request body');
  }

  // Parse it, extract styles icons and scripts
  const doc = parseHTML(res.body);
  const scripts = doc
    .find('script')
    .toArray()
    .map((v) => v.attr('src'))
    .filter((s) => !!s) as string[];
  const assets = doc
    .find('link')
    .toArray()
    .map((v) => v.attr('href'))
    .filter((s) => !!s) as string[];

  // Build requests
  const requests: ObjectBatchRequest[] = scripts.concat(assets).map((src) => ({
    method: 'GET',
    url: Root + src,
  }));
  check(requests, { 'At least 3 frontend ressources to fetch': (r) => r.length > 0 });

  // Send requests
  const responses = batch(requests);
  check(responses, {
    'Frontend assets response code was 200': (res) => res.every((r) => r.status === 200),
  });
}
