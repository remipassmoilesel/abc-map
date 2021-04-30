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
const capabilities = fs.readFileSync(path.resolve(responses, 'capabilities.xml')).toString('utf-8');
const tile = fs.readFileSync(path.resolve(responses, 'tile.png'));
const authorization = 'Basic amVhbi1ib25ubzphemVydHkxMjM0'; // jean-bonno:azerty1234

const wms = express();
wms.use(cors());

wms.get('/public', function (req, res) {
  handleWmsRequest(req, res);
});

wms.get('/authenticated', function (req, res) {
  if (req.headers['authorization'] !== authorization) {
    res.status(401).send();
    return;
  }

  handleWmsRequest(req, res);
});

wms.listen(PORT, 'localhost', () => {
  console.log(`Fake WMS server listening on localhost:${PORT}`);
});

function handleWmsRequest(req, res) {
  if (req.url.endsWith('request=GetCapabilities')) {
    res.set('Content-Type', 'application/xml').status(200).send(capabilities);
    return;
  }

  if (req.url.indexOf('REQUEST=GetMap') !== -1) {
    res.set('Content-Type', 'image/png').status(200).end(tile, 'binary');
    return;
  }

  console.log(`Unexpected request: ${req.url}`);
  res.status(404).send();
}
