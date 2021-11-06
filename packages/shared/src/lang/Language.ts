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

/**
 * Supported languages
 *
 * Values must be compatible with lang attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
 */
export enum Language {
  English = 'en',
  French = 'fr',
}

export const FallbackLang = Language.English;

export function isLangSupported(lang: string | Language): boolean {
  return Object.values(Language).includes(lang as Language);
}

export function langFromString(lang: string): Language | undefined {
  return Object.values(Language).find((l) => l === lang);
}
