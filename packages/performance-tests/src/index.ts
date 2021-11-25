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
import { AuthenticationRequest } from '@abc-map/shared';
import { extractAuthentication, jsonGet, jsonPost, sampleProjectMetadata } from './utils/helpers';
import { FormData } from './utils/FormDataPolyfill';
import { Config } from './utils/Config';

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
 */

const fileOptions: Config = JSON.parse(open(__ENV.CONFIG_FILE));

export const options: Options = {
  vus: fileOptions.vus,
  iterations: fileOptions.iterations,
};

// Simulate a project. This can cause memory issues, but shared array does not work as expected with binary files.
const fakeProject = open('../test-data/project.abm2', 'b');

export default () => {
  fetchFrontend();
  sleep(3);

  // We try to connect with bad credentials
  const badCredentials: AuthenticationRequest = { email: 'bad email', password: 'bad password' };
  const req1 = jsonPost(`${fileOptions.host}/api/authentication`, badCredentials);
  check(req1, {
    'Bad authentication status is 401': (res) => res.status === 401,
  });

  // We login with correct credentials
  const goodCredentials: AuthenticationRequest = { email: `user-${__VU}@abc-map.fr`, password: 'azerty1234' };
  const req2 = jsonPost(`${fileOptions.host}/api/authentication`, goodCredentials);
  const auth = extractAuthentication(req2.body);
  check(req2, {
    'Good authentication status is 200': (res) => res.status === 200,
  });

  sleep(3);

  // We list artefacts
  const req3 = jsonGet(`${fileOptions.host}/api/datastore/list?limit=6&offset=0`, auth);
  check(req3, {
    'List artefacts status is 200': (res) => res.status === 200,
  });

  // We search artefacts
  const req4 = jsonGet(`${fileOptions.host}/api/datastore/search?query=world&lang=en&limit=6&offset=0`, auth);
  check(req4, {
    'Search artefacts status is 200': (res) => res.status === 200,
  });

  // We download artefact 1
  const req5 = jsonGet(`${fileOptions.host}/api/datastore/download/world/world-cities/world-cities.zip`, auth);
  check(req5, {
    'Download artefact 1 status is 200': (res) => res.status === 200,
    'Artefact 1 is heavy': (res) => (res.body?.length || 0) > 10_000,
  });

  // We download artefact 2
  const req6 = jsonGet(`${fileOptions.host}/api/datastore/download/world/world-countries/world-countries.zip`, auth);
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

  const req7 = http.post(`${fileOptions.host}/api/projects`, formData.body(), {
    headers: { ...auth, 'Content-Type': `multipart/form-data; boundary=${formData.boundary}` },
  });
  check(req7, {
    'Project save status is 200': (res) => res.status === 200,
  });

  sleep(3);

  // We list projects
  const req8 = jsonGet(`${fileOptions.host}/api/projects`, auth);
  check(req8, {
    'List projects status is 200': (res) => res.status === 200,
  });

  // We download project
  const req9 = jsonGet(`${fileOptions.host}/api/projects/${projectMetadata.id}`, auth);
  check(req9, {
    'Get project status is 200': (res) => res.status === 200,
    // FIXME: Test setup freeze if size exceed few kb, probably due to k6 memory usage and FormDataPolyfill.ts
    // 'Project is heavy': (res) => (res.body?.length || 0) > 100_000,
  });

  // We delete project
  const req10 = http.del(`${fileOptions.host}/api/projects/${projectMetadata.id}`, undefined, { headers: auth });
  check(req10, {
    'Delete project status is 200': (res) => res.status === 200,
  });
};

function fetchFrontend() {
  // Fetch index.html
  const res = http.get(fileOptions.host);
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
    .filter((v) => v.attr('rel') !== 'alternate')
    .map((v) => v.attr('href'))
    .filter((s) => !!s) as string[];

  // Build requests
  const requests: ObjectBatchRequest[] = scripts.concat(assets).map((src) => ({
    method: 'GET',
    url: fileOptions.host + src,
  }));
  check(requests, { 'At least 3 frontend ressources to fetch': (r) => r.length > 0 });

  // Send requests
  const responses = batch(requests);
  check(responses, {
    'Frontend assets response code was 200': (res) => res.every((r) => r.status === 200),
  });
}
