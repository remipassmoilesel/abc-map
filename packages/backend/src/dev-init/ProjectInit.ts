import { Services } from '../services/services';
import { AbcProject, AbcUser, ManifestName } from '@abc-map/shared-entities';
import { Resources } from '../utils/Resources';
import { promises as fs } from 'fs';
import { CompressedProject } from '../projects/CompressedProject';
import { Zipper } from '../utils/Zipper';
import * as uuid from 'uuid-random';

export class ProjectInit {
  public static create(services: Services) {
    const resources = new Resources();
    return new ProjectInit(services, resources);
  }

  constructor(private services: Services, private resources: Resources) {}

  public async init(users: AbcUser[]): Promise<void> {
    const sampleProject = await this.loadSampleProject();

    for (const user of users) {
      const prs = await this.services.project.list(user.id, 0, 1);
      if (prs.length) {
        continue;
      }

      const project: CompressedProject = {
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
    const files = await Zipper.unzip(project);
    const manifest = files.find((f) => f.path.endsWith(ManifestName));
    if (!manifest) {
      throw new Error(`Invalid project: ${this.resources.getSampleProject()}`);
    }

    const metadata = (JSON.parse(manifest.content.toString('utf-8')) as AbcProject).metadata;
    return { metadata, project };
  }
}
