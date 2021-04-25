/*

This file serve frontend build folder for end to end tests.

*/

const express = require('express');
const { createProxyMiddleware: proxy } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const port = 3005;

const appRoot = path.resolve(__dirname, '..', 'build');
if (!fs.existsSync(appRoot)) {
  throw new Error(`Application frontend root is invalid: ${appRoot}`);
}

const app = express();
app.use(proxy('/api', { target: 'http://localhost:10082' }));
app.use('/', express.static(appRoot));
app.get('/*', function (req, res) {
  res.sendFile(path.resolve(appRoot, 'index.html'));
});

app.listen(port, 'localhost', () => {
  console.log(`Frontend E2E server listening on localhost:${port}`);
});
