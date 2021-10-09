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

import { FallbackLang, Language } from './Language';

export interface I18nText {
  language: Language;
  text: string;
}

export interface I18nList {
  language: Language;
  text: string[];
}

export function getTextByLang(texts: I18nText[], lang: Language): string | undefined {
  const wanted = texts.find((desc) => desc.language === lang);
  const fallback = texts.find((desc) => desc.language === FallbackLang);
  const first = texts.length ? texts[0] : undefined;
  return wanted?.text ?? fallback?.text ?? first?.text;
}

export function getListByLang(texts: I18nList[], lang: Language): string[] | undefined {
  const wanted = texts.find((desc) => desc.language === lang);
  const fallback = texts.find((desc) => desc.language === FallbackLang);
  const first = texts.length ? texts[0] : undefined;
  return wanted?.text ?? fallback?.text ?? first?.text;
}
