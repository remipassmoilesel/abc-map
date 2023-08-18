/**
 * Copyright © 2022 Rémi Pace.
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

import { FromV010ToV020 } from './FromV010ToV020';
import { FromV020ToV030 } from './FromV020ToV030';
import { FromV030ToV040 } from './FromV030ToV040';
import { FromV040ToV050 } from './FromV040ToV050';
import { FromV050ToV060 } from './FromV050ToV060';
import { FromV060ToV070 } from './FromV060ToV070';
import { FromV070ToV080 } from './FromV070ToV080';
import { FromV080ToV090 } from './FromV080ToV090';
import { FromV090ToV100 } from './FromV090ToV100';
import { FromV100ToV110 } from './FromV100ToV110';
import { ModalService } from '../../ui/ModalService';
import { FromV110ToV120 } from './FromV110ToV120';
import { FromV120ToV130 } from './FromV120ToV130';

export function getMigrations(modals: ModalService) {
  // Order of migrations is important
  return [
    new FromV010ToV020(),
    new FromV020ToV030(modals),
    new FromV030ToV040(),
    new FromV040ToV050(),
    new FromV050ToV060(),
    new FromV060ToV070(),
    new FromV070ToV080(),
    new FromV080ToV090(),
    new FromV090ToV100(),
    new FromV100ToV110(),
    new FromV110ToV120(modals),
    new FromV120ToV130(),
  ];
}
