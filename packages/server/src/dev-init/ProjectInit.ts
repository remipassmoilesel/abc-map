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

import { Services } from '../services/services';
import { AbcUser, Logger, ProjectHelper } from '@abc-map/shared';
import { Resources } from '../utils/Resources';
import { promises as fs } from 'fs';
import * as uuid from 'uuid-random';
import { CompressedProject, NodeBinary } from '@abc-map/shared/build/project/CompressedProject';

const logger = Logger.get('ProjectInit');

export class ProjectInit {
  public static create(services: Services) {
    const resources = new Resources();
    return new ProjectInit(services, resources);
  }

  constructor(private services: Services, private resources: Resources) {}

  public async init(users: AbcUser[]): Promise<void> {
    let sampleProject: CompressedProject | undefined;
    try {
      sampleProject = await this.loadSampleProject();
    } catch (e) {
      logger.warn('Cannot read sample project, no project will be created');
      return;
    }

    for (const user of users) {
      const prs = await this.services.project.list(user.id, 0, 1);
      if (prs.length) {
        continue;
      }

      const project: CompressedProject<NodeBinary> = {
        ...sampleProject,
        metadata: {
          ...sampleProject.metadata,
          id: uuid(),
        },
      };
      await this.services.project.save(user.id, project);
    }
  }

  private async loadSampleProject(): Promise<CompressedProject> {
    const project = await fs.readFile(this.resources.getSampleProject());
    const manifest = await ProjectHelper.forBackend().extractManifest(project);
    return { metadata: manifest.metadata, project };
  }
}
