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
import { AbcProjectManifest, Logger, ProjectHelper } from '@abc-map/shared';
import { ResourcePath } from '../utils/ResourcePath';
import { promises as fs } from 'fs';
import * as uuid from 'uuid-random';
import { Config } from '../config/Config';

const logger = Logger.get('ProjectInit.ts', 'info');

export class ProjectInit {
  public static create(config: Config, services: Services) {
    const resources = new ResourcePath();
    return new ProjectInit(config, services, resources);
  }

  constructor(private config: Config, private services: Services, private resources: ResourcePath) {}

  public async init(): Promise<void> {
    if (!this.config.development?.generateData) {
      return;
    }

    const alreadyDone = !!(await this.services.project.findAllMetadatas()).length;
    if (alreadyDone) {
      return;
    }

    let projectsCreated = 0;
    const users = await this.services.user.findAll(100);

    const { project: privateProject, manifest: privateManifest } = await this.loadSampleProject(this.resources.getSamplePrivateProject());
    const { project: publicProject, manifest: publicManifest } = await this.loadSampleProject(this.resources.getSamplePublicProject());

    for (const user of users) {
      const hasProjects = !!(await this.services.project.findByUserId(user.id, 0, 1)).length;
      if (hasProjects) {
        continue;
      }

      const projectsPerUser = this.config.development.generateData.projectsPerUser;
      const privateProjects = Math.max(2, Math.round(projectsPerUser * 0.5));
      const publicProjects = projectsPerUser - privateProjects;

      let p = 0;
      const projectName = (prefix: string) => `${prefix} project ${++p}`;

      for (let i = 0; i < privateProjects; i++) {
        const manifest: AbcProjectManifest = {
          ...privateManifest,

          metadata: {
            ...privateManifest.metadata,
            id: uuid(),
            name: projectName(`Private`),
          },
        };

        const project = await ProjectHelper.forNodeJS().updateManifest(privateProject, manifest);
        await this.services.project.save(user.id, project);
        projectsCreated++;
      }

      for (let i = 0; i < publicProjects; i++) {
        const manifest: AbcProjectManifest = {
          ...publicManifest,

          metadata: {
            ...publicManifest.metadata,
            id: uuid(),
            name: projectName(`Public`),
          },
        };

        const project = await ProjectHelper.forNodeJS().updateManifest(publicProject, manifest);
        await this.services.project.save(user.id, project);
        projectsCreated++;
      }
    }

    logger.info(`${projectsCreated} projects created.`);
  }

  private async loadSampleProject(path: string): Promise<{ manifest: AbcProjectManifest; project: Buffer }> {
    const project = await fs.readFile(path);
    const manifest = await ProjectHelper.forNodeJS().extractManifest(project);
    return { manifest, project };
  }
}
