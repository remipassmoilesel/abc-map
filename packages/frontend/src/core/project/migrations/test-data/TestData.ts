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
import { MigratedProject } from '../typings';
import { AbcProjectManifest, ProjectHelper, Zipper } from '@abc-map/shared';

export class TestData {
  public static async project01(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.1.abm2`);
  }

  public static async project020(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.2.0.abm2`);
  }

  public static async project030(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.3.0.abm2`);
  }

  public static async project040(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.4.0.abm2`);
  }

  public static async project050(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.5.0.abm2`);
  }

  public static async project060(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.6.0.abm2`);
  }

  public static async project070(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.7.0.abm2`);
  }

  public static async project080(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.8.0.abm2`);
  }

  public static async project090(): Promise<MigratedProject> {
    return this.fileToMigratedProject(`${__dirname}/project-0.9.0.abm2`);
  }

  public static fakeProject(version: string) {
    return { metadata: { version } } as unknown as AbcProjectManifest;
  }

  private static async fileToMigratedProject(path: string): Promise<MigratedProject> {
    const zip = fs.readFileSync(path);
    const res = await Zipper.forBackend().unzip(zip);
    const manifest = await ProjectHelper.forBackend().extractManifest(zip);
    const files = res.map((f) => ({ path: f.path, content: new Blob([f.content]) }));

    return { manifest, files };
  }
}
