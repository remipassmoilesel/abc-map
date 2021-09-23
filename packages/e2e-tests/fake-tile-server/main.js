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

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const PORT = 3010;
const responses = path.resolve(__dirname, 'responses');
const authorization = 'Basic amVhbi1ib25ubzphemVydHkxMjM0'; // jean-bonno:azerty1234

const app = express();
app.use(cors());

/*

  XYZ

 */

const tileXyz = fs.readFileSync(path.resolve(responses, 'tile-xyz.png'));

app.get('/xyz*', function (req, res) {
  handleXyzRequest(req, res);
});

function handleXyzRequest(req, res) {
  res.set('Content-Type', 'image/png').status(200).end(tileXyz, 'binary');
}

/*

  WMS

 */

const wmsCapabilities = fs.readFileSync(path.resolve(responses, 'wms-capabilities.xml')).toString('utf-8');
const tileWms = fs.readFileSync(path.resolve(responses, 'tile-wms.png'));

app.get('/wms/public', function (req, res) {
  handleWmsRequest(req, res);
});

app.get('/wms/authenticated', function (req, res) {
  if (req.headers['authorization'] !== authorization) {
    res.status(401).send();
    return;
  }

  handleWmsRequest(req, res);
});

function handleWmsRequest(req, res) {
  if (req.url.endsWith('request=GetCapabilities')) {
    res.set('Content-Type', 'application/xml').status(200).send(wmsCapabilities);
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

app.get('/wmts/public', function (req, res) {
  handleWmtsRequest(req, res);
});

app.get('/wmts/authenticated', function (req, res) {
  if (req.headers['authorization'] !== authorization) {
    res.status(401).send();
    return;
  }

  handleWmtsRequest(req, res);
});

function handleWmtsRequest(req, res) {
  if (req.url.endsWith('request=GetCapabilities')) {
    res.set('Content-Type', 'application/xml').status(200).send(wmtsCapabilities);
    return;
  }

  if (req.url.indexOf('Request=GetTile') !== -1) {
    res.set('Content-Type', 'image/png').status(200).end(tileWmts, 'binary');
    return;
  }

  console.log(`Unexpected WMTS request: ${req.url}`);
  res.status(404).send();
}

/*

  Start server

 */

app.listen(PORT, 'localhost', () => {
  console.log(`Fake tile server listening on localhost:${PORT}`);
});
