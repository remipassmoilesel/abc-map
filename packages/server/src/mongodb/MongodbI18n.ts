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

import { I18nList, I18nText, Language } from '@abc-map/shared';

export enum MongoLanguage {
  English = 'english',
  French = 'french',
}

export interface MongoI18nText {
  language: MongoLanguage;
  text: string;
}

export interface MongoI18nList {
  language: MongoLanguage;
  text: string[];
}

export class MongoI18nMapper {
  public static langToMongo(lang: Language): MongoLanguage {
    // This weird switch will type check MongoLanguage match
    switch (lang) {
      case Language.English:
        return MongoLanguage.English;
      case Language.French:
        return MongoLanguage.French;
    }
  }

  public static langFromMongo(lang: MongoLanguage): Language {
    // This weird switch will type check MongoLanguage match
    switch (lang) {
      case MongoLanguage.English:
        return Language.English;
      case MongoLanguage.French:
        return Language.French;
    }
  }

  public static textFromMongo(text: MongoI18nText): I18nText {
    return {
      language: MongoI18nMapper.langFromMongo(text.language),
      text: text.text,
    };
  }

  public static textToMongo(text: I18nText): MongoI18nText {
    return {
      language: MongoI18nMapper.langToMongo(text.language),
      text: text.text,
    };
  }

  public static listFromMongo(text: MongoI18nList): I18nList {
    return {
      language: MongoI18nMapper.langFromMongo(text.language),
      text: text.text.slice(),
    };
  }

  public static listToMongo(text: I18nList): MongoI18nList {
    return {
      language: MongoI18nMapper.langToMongo(text.language),
      text: text.text.slice(),
    };
  }
}
