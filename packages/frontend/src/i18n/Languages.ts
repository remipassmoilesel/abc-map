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

import frIcon from './icons/fr.svg';
import enIcon from './icons/en.svg';
import { Language } from '@abc-map/shared';

export interface LabeledLanguages {
  value: Language;
  label: string;
  icon: string;
}

export class LabeledLanguages {
  public static French: LabeledLanguages = {
    value: Language.French,
    label: 'Français',
    icon: frIcon,
  };

  public static English: LabeledLanguages = {
    value: Language.English,
    label: 'English',
    icon: enIcon,
  };

  public static All = [LabeledLanguages.French, LabeledLanguages.English];
}
