#!/usr/bin/env node
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

const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

const projectRoot = path.resolve(__dirname, '../../../');
const source = path.resolve(projectRoot, 'CHANGELOG.md');
const target = path.resolve(projectRoot, 'packages/frontend/public/static/CHANGELOG.html');
const commitBaseUrl = 'https://gitlab.com/abc-map/abc-map/-/tree';

buildHtmlChangelog();

function buildHtmlChangelog() {
  let changelog = fs.readFileSync(source).toString('utf-8');
  changelog = changelog.split('\n').slice(1).join('\n'); // We skip title
  changelog = linkify(changelog);

  const converter = new showdown.Converter({openLinksInNewWindow: true});
  const html = converter.makeHtml(changelog);
  fs.writeFileSync(target, html);

  console.log(`HTML changelog generated from ${source} to ${target}`);
}

function linkify(input) {
  const urlPattern = /([^\]\(]){1}(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  const emailPattern = /(([a-zA-Z0-9_\-.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;

  const commitPattern = /(\(git: ([A-Z0-9+]+)\))/gim;

  let output = input.replace(urlPattern, ' <a href="$2" target="_blank">$2</a>');
  output = output.replace(emailPattern, ' <a href="mailto:$1">$1</a>');
  output = output.replace(commitPattern, ` <a href="${commitBaseUrl}/$2" target="_blank">$1</a>`);
  return output;
}


