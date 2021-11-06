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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { FallbackLang, Language, Logger } from '@abc-map/shared';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DocumentationLang } from '@abc-map/user-documentation';
import en from './translations/en.json';
import fr from './translations/fr.json';

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
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ABC_LANGUAGE',
    },
    resources: resources,
    supportedLngs: Object.values(Language),
    fallbackLng: FallbackLang,
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((err) => logger.error('i18n init error:', err));

export interface StringMap {
  [k: string]: string | number;
}

/**
 * This function reduce translation boilerplate. Usage:
 *
 * ```
 *  const t = prefixedTranslation('Namespace:Parent.');
 *
 *  t('Key') // Will use 'Namespace:Parent.Key'
 * ```
 *
 * If you use it within a react component, you must wrap component with withTranslation();
 *
 * @param prefix
 */
export function prefixedTranslation(prefix: string) {
  return (key: string, params?: StringMap) => i18n.t(`${prefix}${key}`, params);
}

export async function setLang(lang: Language): Promise<void> {
  await i18n.changeLanguage(lang);
  document.documentElement.setAttribute('lang', lang);
}

export function getLang(): Language {
  return i18n.language as Language;
}

export function getDocumentationLang(): DocumentationLang {
  // This weird switch will type check DocumentationLang match
  const lang = getLang();
  switch (lang) {
    case Language.English:
      return DocumentationLang.English;
    case Language.French:
      return DocumentationLang.French;
  }
}
