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

import { Logger } from '@abc-map/shared';

const logger = Logger.get('page-setup.ts');

export function pageSetup(title: string, description?: string) {
  document.title = `Abc-Map - ${title}`;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | undefined;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.append(meta);
  }

  if (description && description.length > 155) {
    logger.warn(`Description is too long: ${description.length} ${description}`);
  }
  meta.content = description || '';
}

export function addNoIndexMeta() {
  let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | undefined;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'robots';
    document.head.append(meta);
  }

  meta.content = 'noindex';
  document.head.append(meta);
}

export function removeNoIndexMeta() {
  const metas = document.querySelectorAll('meta[name=robots][content=noindex]');

  metas.forEach((m) => m.parentNode?.removeChild(m));
}
