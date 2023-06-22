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

import * as fs from 'fs';
import { MigrationProject } from '../typings';
import { AbcProjectManifest, ProjectHelper, Zipper } from '@abc-map/shared';

export class TestData {
  public static async project01(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.1.abm2`);
  }

  public static async project020(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.2.0.abm2`);
  }

  public static async project030(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.3.0.abm2`);
  }

  public static async project040(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.4.0.abm2`);
  }

  public static async project050(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.5.0.abm2`);
  }

  public static async project060(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.6.0.abm2`);
  }

  public static async project070(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.7.0.abm2`);
  }

  public static async project080(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.8.0.abm2`);
  }

  public static async project090(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-0.9.0.abm2`);
  }

  public static async project100(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-1.0.0.abm2`);
  }

  public static async project110(): Promise<MigrationProject> {
    return this.readFile(`${__dirname}/project-1.1.0.abm2`);
  }

  public static fakeProject(version: string) {
    return { metadata: { version } } as unknown as AbcProjectManifest;
  }

  private static async readFile(path: string): Promise<MigrationProject> {
    const archive = fs.readFileSync(path);
    const files = await Zipper.forNodeJS().unzip(archive);
    const manifest = await ProjectHelper.forNodeJS().extractManifest(archive);
    const blobFiles = files.map((f) => ({ path: f.path, content: new Blob([f.content as Buffer]) }));

    return { manifest, files: blobFiles };
  }
}
