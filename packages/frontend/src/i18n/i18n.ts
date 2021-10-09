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

import i18n, { StringMap } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language, Logger } from '@abc-map/shared';
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
    // TODO: set to English when translation finish
    fallbackLng: Language.French,
    supportedLngs: Object.values(Language),
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((err) => logger.error('i18n init error:', err));

export function namespacedTranslation(namespace: string) {
  return (key: string, params?: StringMap) => i18n.t(`${namespace}:${key}`, params);
}

export function setLang(lang: Language): Promise<unknown> {
  return i18n.changeLanguage(lang);
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
