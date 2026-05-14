/**
 * Copyright © 2026 Rémi Pace.
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
import en from './translations/en.json';
import fr from './translations/fr.json';
import type { TipsLang } from '../core/tips';

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
    showSupportNotice: false,
  })
  .catch((err) => logger.error('i18n init error:', err));

/**
 * Use this to obtain a prefixed translation function.
 *
 * This function will use the current language set by user in UI.
 *
 * You MUST NOT use this function in React contexts:
 * - In React class components you can use:   const t = this.props.i18n.getFixedT(this.props.i18n.language, 'ColorPicker');
 * - In React FC you can use:   const { t } = useTranslation('useExportProject');
 */
export function prefixedTranslation(namespace: string): (s: string, args?: object | undefined) => string {
  return (s, args) => {
    const key = namespace + ':' + s;
    // FIXME: Find better typings
    return i18n.t(key, args as unknown as string);
  };
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
