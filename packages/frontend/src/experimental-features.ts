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

import { I18nText, Language } from '@abc-map/shared';

/*
 * You can reference in this file features that will not be enabled by default.
 */

export interface ExperimentalFeature {
  id: string;
  description: I18nText[];
}

/**
 * Artefact generator is a data processing module used to create artefacts for WMS/WMTS/XYZ layers.
 *
 * It will never be enabled by default.
 */
export const ArtefactGenerator: ExperimentalFeature = {
  id: 'ArtefactGenerator',
  description: [
    {
      language: Language.English,
      text: 'This is an experimental data processing module, not intended for use by end users. You need to reload the app after activating it.',
    },
    {
      language: Language.French,
      text:
        "C'est un module de traitement de données expérimental, non destiné à être utilisé par les utilisateurs finaux. " +
        "Vous devez recharger l'application après l'avoir activée.",
    },
  ],
};

export const ExperimentalFeatures: ExperimentalFeature[] = [ArtefactGenerator];
