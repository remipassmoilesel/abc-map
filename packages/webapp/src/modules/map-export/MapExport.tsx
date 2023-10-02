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

import { ModuleAdapter } from '@abc-map/module-api';
import { BundledModuleId } from '@abc-map/shared';
import { MapExportView } from './view/MapExportView';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('MapExport:');

export class MapExport extends ModuleAdapter {
  public getId() {
    return BundledModuleId.MapExport;
  }

  public getReadableName(): string {
    return t('Map_export');
  }

  public getShortDescription(): string {
    return t('Create_layout_to_export');
  }

  public getView() {
    return <MapExportView />;
  }
}
