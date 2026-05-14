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

import ProjectsModuleView from './view/ProjectManagementView';
import { ModuleId } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import type { AbcModule } from '../AbcModule.ts';

const t = prefixedTranslation('ProjectManagement');

export class ProjectManagement implements AbcModule {
  public getId() {
    return ModuleId.ProjectManagement;
  }

  public getReadableName(): string {
    return t('Project_management');
  }

  public getShortDescription(): string {
    return t('Import_export_save_your_projects_online');
  }

  public getView() {
    return () => <ProjectsModuleView />;
  }
}
