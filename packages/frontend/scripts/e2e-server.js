/*

This file serve frontend build folder for end to end tests.

*/

const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');

const port = 3005;
const appRoot = path.resolve(__dirname, '..', 'build');
const app = express();

app.use(express.static(appRoot));

app.get('*', function (req, res) {
  res.sendFile(path.resolve(appRoot, 'index.html'));
});

app.use(proxy('localhost:10082'));

app.listen(port, 'localhost', () => {
  console.log(`Server listening on localhost:${port}`);
});
