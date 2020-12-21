import { Services } from '../services/services';
import { AbcProject } from '@abc-map/shared-entities';
import { Resources } from '../utils/Resources';
import { promises as fs } from 'fs';
import * as path from 'path';

export class ProjectInit {
  public static create(services: Services) {
    const resources = new Resources();
    return new ProjectInit(services, resources);
  }

  constructor(private services: Services, private resources: Resources) {}

  public async init(): Promise<void> {
    const projects = await this.loadSampleProjects();
    if (await this.alreadyDone(projects[0].metadata.id)) {
      return;
    }

    for (const pr of projects) {
      await this.services.project.save(pr);
    }
  }

  public async alreadyDone(witnessId: string): Promise<boolean> {
    const pr = await this.services.project.findById(witnessId);
    return !!pr;
  }

  private async loadSampleProjects(): Promise<AbcProject[]> {
    const root = this.resources.getResourcePath('sample-projects');
    const entries = await fs.readdir(root);
    const projects: AbcProject[] = [];
    for (const entry of entries) {
      const projectPath = path.resolve(root, entry);
      if (!entry.toLocaleLowerCase().endsWith('.abm2')) {
        continue;
      }

      const content = (await fs.readFile(projectPath)).toString('utf-8');
      projects.push(JSON.parse(content));
    }
    return projects;
  }
}
