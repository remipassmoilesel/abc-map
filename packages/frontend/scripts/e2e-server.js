const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');

const appRoot = path.resolve(__dirname, '..', 'build');
const app = express();

app.use(express.static(appRoot));

app.get('*', function (req, res) {
  res.sendFile(path.resolve(appRoot, 'index.html'));
});

app.use(proxy('localhost:10082'));

app.listen(3000, 'localhost', () => {
  console.log('Server listening on localhost:3000');
});
