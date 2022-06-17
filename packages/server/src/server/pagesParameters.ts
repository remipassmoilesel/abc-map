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

import { Language } from '@abc-map/shared';
import { Config } from '../config/Config';

//
//  /!\ As values are templated in arguments, use quotes with caution
//

interface IndexParameters {
  lang: string;
  title: string;
  description: string;
  keywords: string;
  noScript: string;
  externalUrl: string;
  appendToBody: string | undefined;
}

export function indexParameters(config: Config, lang: Language): IndexParameters {
  switch (lang) {
    case Language.French:
      return {
        lang,
        title: '🌍 Abc-Map - Cartographie libre et gratuite en ligne',
        description: 'Abc-Map, nouvelle version 🚀 Créez des cartes géographiques simplement: importez, dessinez, visualisez des données, et bien plus !',
        keywords: 'carte, cartographie, géographie, système information géographique, statistique, analyse spatiale, logiciel en ligne',
        noScript: 'Vous devez activer Javascript pour utiliser cette application',
        externalUrl: config.externalUrl,
        appendToBody: config.frontend?.appendToBody,
      };
    case Language.English:
      return {
        lang,
        title: '🌍 Abc-Map - Free (as in freedom) online mapping',
        description: 'Abc-Map, new version 🚀 Easily create geographic maps: import, draw, visualize data, and more!',
        keywords: 'map, cartography, geography, geographic information system, statistics, spatial analysis, online software',
        noScript: 'You must enable JavaScript to use this application',
        externalUrl: config.externalUrl,
        appendToBody: config.frontend?.appendToBody,
      };
  }
}

interface Error409Parameters {
  lang: string;
  title: string;
  message: string;
}

export function error409Parameters(lang: Language): Error409Parameters {
  switch (lang) {
    case Language.French:
      return {
        lang,
        title: 'Quota de demandes dépassé 😭',
        message: 'Nous avons reçu trop de demandes en provenance de votre adresse IP, veuillez réessayer plus tard.',
      };
    case Language.English:
      return {
        lang,
        title: 'Quota of requests exceeded 😭',
        message: 'We have received too many requests from your IP address, please try again later.',
      };
  }
}
