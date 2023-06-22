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

import { ModuleAdapter } from '@abc-map/module-api';
import { LocalModuleId } from '../LocalModuleId';
import DataStoreView from './DataStoreView';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('DataStoreModule:');

export class DataStoreModule extends ModuleAdapter {
  public getId() {
    return LocalModuleId.DataStore;
  }

  public getReadableName(): string {
    return t('Data_store');
  }

  public getShortDescription(): string {
    return t('Add_data_easily');
  }

  public getView() {
    return <DataStoreView />;
  }
}
