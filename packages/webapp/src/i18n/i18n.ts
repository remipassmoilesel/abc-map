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

import i18n, { TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { FallbackLang, Language, Logger } from '@abc-map/shared';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en.json';
import fr from './translations/fr.json';
import { TipsLang } from '../core/tips';

const logger = Logger.get('i18n.tsx');

const resources = {
  [Language.English]: en,
  [Language.French]: fr,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupLocalStorage: 'ABC_MAP_LANGUAGE',
    },
    resources: resources,
    supportedLngs: Object.values(Language),
    fallbackLng: FallbackLang,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })
  .catch((err) => logger.error('i18n init error:', err));

export interface StringMap {
  [k: string]: string | number;
}

/**
 * Use this function outside of react component to reduce translation boilerplate.
 *
 * Usage:
 *
 * ```
 *  const t = prefixedTranslation('Namespace:Parent.');
 *
 *  t('Key') // Will use 'Namespace:Parent.Key'
 * ```
 *
 * Do not use it in React components, use `keyPrefix` instead:
 *
 * ```
 *    const t = useTranslation('TopLevelNamespace', {keyPrefix: 'Nested.Namespaces'})
 * ```
 *
 * @param prefix
 */
// TODO: terminate refactoring, remove bad usages
export function prefixedTranslation(prefix: string) {
  return prefixI18nTFunc(prefix, i18n.t);
}

export function prefixI18nTFunc(prefix: string, tFunc: TFunction) {
  return (key: string, params?: StringMap) => tFunc(`${prefix}${key}`, params || {});
}

export async function setLang(lang: Language): Promise<void> {
  await i18n.changeLanguage(lang);
  document.documentElement.setAttribute('lang', lang);
}

export function getLang(): Language {
  return i18n.language as Language;
}

export function getTipsLang(): TipsLang {
  const lang = getLang();
  switch (lang) {
    case Language.French:
      return lang;
    default:
      return Language.English;
  }
}

export function getNumberFormatter(): Intl.NumberFormat {
  const lang = getLang();
  switch (lang) {
    case Language.French:
      return new Intl.NumberFormat('fr-FR');
    default:
      return new Intl.NumberFormat('en-EN');
  }
}
