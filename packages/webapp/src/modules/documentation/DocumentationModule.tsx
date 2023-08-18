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
import { BundledModuleId } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { LazyExoticComponent } from 'react';
import DocumentationView from './view/DocumentationView';

const t = prefixedTranslation('DocumentationModule:');

export class DocumentationModule extends ModuleAdapter {
  public getId(): ModuleId {
    return BundledModuleId.Documentation;
  }

  public getReadableName(): string {
    return t('Documentation');
  }

  public getShortDescription(): string {
    return t('Everything_you_need_to_know_about_Abc-Map');
  }

  public getView(): JSX.Element | LazyExoticComponent<any> {
    return <DocumentationView />;
  }
}
