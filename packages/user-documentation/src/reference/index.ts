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

import * as referenceFr from './fr';
import * as referenceEn from './en';
import { DocumentationLang } from '../DocumentationLang';

export interface I18nReference {
  lang: DocumentationLang;
  toc: string;
  modules: string[];
}

export const References: I18nReference[] = [
  {
    lang: DocumentationLang.French,
    toc: referenceFr.toc,
    modules: referenceFr.content,
  },
  {
    lang: DocumentationLang.English,
    toc: referenceEn.toc,
    modules: referenceEn.content,
  },
];
