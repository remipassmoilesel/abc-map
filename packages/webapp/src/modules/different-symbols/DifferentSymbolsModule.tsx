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

import DifferentSymbolsView from './view/DifferentSymbolsView';
import { ModuleId } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import type { AbcModule } from '../AbcModule.ts';

const t = prefixedTranslation('DifferentSymbolsModule');

export class DifferentSymbolsModule implements AbcModule {
  public getId() {
    return ModuleId.DifferentSymbols;
  }

  public getReadableName(): string {
    return t('Different_symbols');
  }

  public getShortDescription(): string {
    return t('Module_not_terminated') + ' ' + t('This_module_will');
  }

  public getView() {
    return () => <DifferentSymbolsView />;
  }
}
