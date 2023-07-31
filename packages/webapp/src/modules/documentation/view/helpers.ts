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
 *
 *
 *
 */

const indexRegex = /index.html/gi;

/**
 * This function transform a webapp documentation URL to a static documentation URL
 *
 * @param pathname
 */
export function rewriteContentPath(pathname: string): string {
  const parts = pathname.split('/').filter((v) => !!v.trim() && !v.match(indexRegex));
  const lang = parts[0];
  return withTrailingSlash('/documentation/' + lang + '/' + parts.slice(3, parts.length).join('/'));
}

/**
 * This function recursively search assets in "content" and rewrite their source URL to match
 * webapp route scheme
 *
 * @param content
 * @param contentRoute
 */
export function rewriteAssetsUrls(content: Element, contentRoute: string) {
  const elements = content.querySelectorAll('img,video') as NodeListOf<HTMLVideoElement | HTMLImageElement>;
  for (const element of elements) {
    if (element.tagName === 'IMG' || element.tagName === 'VIDEO') {
      const existingSrc = element.getAttribute('src');
      element.src = contentRoute + existingSrc;
    }
  }
}

export function isExternalURL(url: string) {
  const _url = url.trim().toLowerCase();
  return _url.startsWith('http') || _url.startsWith('www');
}

function withTrailingSlash(str: string): string {
  if (!str.trim().endsWith('/')) {
    return str.trim() + '/';
  }

  return str;
}
