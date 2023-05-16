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
import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import cors from 'cors';

const PORT = 3010;
const responses = path.resolve(__dirname, 'responses');
const authorizationApiKey = '5e46d49fce0';
const basicAuthorizationMiddleware = () =>
  require('express-basic-auth')({
    users: { 'jean-bonno': 'azerty1234' },
  });

const app = express();
app.use(cors());

/*

  XYZ

 */

const tileXyz = fs.readFileSync(path.resolve(responses, 'tile-xyz.png'));

app.get('/xyz/public/*', function (req, res) {
  handleXyzRequest(req, res);
});

app.get('/xyz/authenticated/*', function (req, res) {
  if (req.query.api_key !== authorizationApiKey) {
    res.status(401).send();
    return;
  }

  handleXyzRequest(req, res);
});

function handleXyzRequest(req: express.Request, res: express.Response) {
  res.set('Content-Type', 'image/png').status(200).end(tileXyz, 'binary');
}

/*

  WMS

 */

const wmsCapabilities = fs.readFileSync(path.resolve(responses, 'wms-capabilities.xml')).toString('utf-8');
const tileWms = fs.readFileSync(path.resolve(responses, 'tile-wms.png'));

app.get('/wms/public', function (req, res) {
  handleWmsRequest(req, res, false);
});

app.get('/wms/authenticated', basicAuthorizationMiddleware(), function (req, res) {
  handleWmsRequest(req, res, true);
});

function handleWmsRequest(req: express.Request, res: express.Response, authenticated: boolean) {
  if (req.url.endsWith('request=GetCapabilities')) {
    const capabilities = authenticated
      ? wmsCapabilities.replace(/http:\/\/localhost:3010\/wms\/public/gi, 'http://localhost:3010/wms/authenticated')
      : wmsCapabilities;
    res.set('Content-Type', 'application/xml').status(200).send(capabilities);
    return;
  }

  if (req.url.indexOf('REQUEST=GetMap') !== -1) {
    res.set('Content-Type', 'image/png').status(200).end(tileWms, 'binary');
    return;
  }

  console.log(`Unexpected WMS request: ${req.url}`);
  res.status(404).send();
}

/*

  WMTS

*/

const wmtsCapabilities = fs.readFileSync(path.resolve(responses, 'wmts-capabilities.xml')).toString('utf-8');
const tileWmts = fs.readFileSync(path.resolve(responses, 'tile-wmts.png'));

app.get('/wmts/public*', function (req, res) {
  handleWmtsRequest(req, res, false);
});

app.get('/wmts/authenticated*', basicAuthorizationMiddleware(), function (req, res) {
  handleWmtsRequest(req, res, true);
});

function handleWmtsRequest(req: express.Request, res: express.Response, authenticated: boolean) {
  if (req.url.endsWith('request=GetCapabilities') || req.url.indexOf('WMTSCapabilities.xml') !== -1) {
    const capabilities = authenticated
      ? wmtsCapabilities.replace(/http:\/\/localhost:3010\/wmts\/public/gi, 'http://localhost:3010/wmts/authenticated')
      : wmtsCapabilities;
    res.set('Content-Type', 'application/xml').status(200).send(capabilities);
    return;
  }

  if (req.url.indexOf('Request=GetTile') !== -1 || req.url.indexOf('/layer') !== -1) {
    res.set('Content-Type', 'image/png').status(200).end(tileWmts, 'binary');
    return;
  }

  console.log(`Unexpected WMTS request: ${req.url}`);
  res.status(404).send();
}

/*

  Start server

 */

// We can't use localhost because app in Cypress cannot access it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fake tile server listening on localhost:${PORT}`);
});
