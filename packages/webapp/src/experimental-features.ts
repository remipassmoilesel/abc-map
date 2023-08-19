/**
 * Copyright © 2023 Rémi Pace.
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
import { isDevelopmentWorkerEnv } from './serviceWorkerRegistration';

/*
 * You can reference in this file features that will not be enabled by default.
 */

export interface ExperimentalFeature {
  id: string;
  description: I18nText[];
  condition?: () => boolean;
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
      text: `This is an experimental data processing module.`,
    },
    {
      language: Language.French,
      text: 'Ceci est un module de traitement de données expérimental.',
    },
  ],
};

/**
 * Enable service worker on development environment.
 *
 */
export const DevServiceWorker: ExperimentalFeature = {
  id: 'DevServiceWorker',
  condition: isDevelopmentWorkerEnv,
  description: [
    {
      language: Language.English,
      text: `You should not enable this feature unless you know what you are doing.<br/>
             See: https://create-react-app.dev/docs/making-a-progressive-web-app/#offline-first-considerations`,
    },
    {
      language: Language.French,
      text: `Vous ne devriez pas activer cette fonction à moins que vous ne sachiez ce que vous faites.<br/>
             Voir: https://create-react-app.dev/docs/making-a-progressive-web-app/#offline-first-considerations`,
    },
  ],
};

export const DisableWarningBeforeUnload: ExperimentalFeature = {
  id: 'DisableWarningBeforeUnload',
  description: [
    {
      language: Language.English,
      text: `Disable the "Reload page ? Changes you made may not be saved." warning shown by the browser.`,
    },
    {
      language: Language.French,
      text: `Désactiver l'avertissement "Etes vous sur ? Les modifications ne sont peut être pas enregistrées" montré par le navigateur.`,
    },
  ],
};

export const ExperimentalFeatures: ExperimentalFeature[] = [ArtefactGenerator, DevServiceWorker, DisableWarningBeforeUnload];
