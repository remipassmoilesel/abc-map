/**
 * Copyright © 2023 Rémi Pace.
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

export function prettyStringify(value: any): string {
  return typeof value !== 'undefined' && value !== null ? JSON.stringify(value) : 'Valeur non définie';
}

const div = document.createElement('div');

export function stripHtml(value: string): string {
  div.innerHTML = value;
  return div.textContent || div.innerText || '';
}

const urlPattern = /(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
const emailPattern = /(([a-zA-Z0-9_\-.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;

export function linkify(input: string): string {
  let output = input.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
  output = output.replace(emailPattern, '<a href="mailto:$1">$1</a>');
  return output;
}
