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
import { BudgetItem } from './BudgetItem';

export const Expenses: BudgetItem[] = [
  {
    id: '2020-1',
    description: hostingLabel(2020),
    value: -633.6,
  },
  {
    id: '2021-1',
    description: hostingLabel(2021),
    value: -633.6,
  },
  {
    id: '2021-2',
    description: [
      { language: Language.French, text: 'Prestation UX 2021' },
      { language: Language.English, text: 'UX service 2021' },
    ],
    value: -95.05,
  },
  {
    id: '2022-1',
    description: hostingLabel(2022),
    value: -633.6,
  },
  {
    id: '2023-1',
    description: hostingLabel(2023),
    value: -633.6,
  },
];

export const Income: BudgetItem[] = [
  {
    id: '2020-1',
    description: donationsLabel(2021),
    value: 85.59,
  },
  {
    id: '2021-1',
    description: donationsLabel(2021),
    value: 88.94,
  },
  {
    id: '2022-1',
    description: donationsLabel(2022),
    value: 9.16,
  },
  {
    id: '2023-1',
    description: donationsLabel(2023),
    value: 9.36,
  },
];

function donationsLabel(year: number): I18nText[] {
  return [
    { language: Language.French, text: 'Dons ' + year },
    { language: Language.English, text: 'Donations ' + year },
  ];
}

function hostingLabel(year: number): I18nText[] {
  return [
    { language: Language.French, text: 'Hébergement ' + year },
    { language: Language.English, text: 'Hosting ' + year },
  ];
}
