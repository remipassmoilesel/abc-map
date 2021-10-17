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

import { FastifyRequest } from 'fastify';
import { FallbackLang, isLangSupported, langFromString, Language } from '@abc-map/shared';
import * as parser from 'accept-language-parser';

export function getLang(req: FastifyRequest): Language {
  const header = req.headers['accept-language'];
  if (!header) {
    return FallbackLang;
  }

  const lang = langFromString(parser.parse(header).find((lang) => isLangSupported(lang.code))?.code || '');
  return lang || FallbackLang;
}
