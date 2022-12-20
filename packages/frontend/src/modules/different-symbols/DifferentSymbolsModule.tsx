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

import { ModuleAdapter, ModuleId } from '@abc-map/module-api';
import DifferentSymbolsView from './view/DifferentSymbolsView';
import { LocalModuleId } from '../LocalModuleId';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('DifferentSymbolsModule:');

export class DifferentSymbolsModule extends ModuleAdapter {
  public getId(): ModuleId {
    return LocalModuleId.DifferentSymbols;
  }

  public getReadableName(): string {
    return t('Different_symbols');
  }

  public getShortDescription(): string {
    return t('Module_not_terminated') + ' ' + t('This_module_will');
  }

  public getView() {
    return <DifferentSymbolsView />;
  }
}
