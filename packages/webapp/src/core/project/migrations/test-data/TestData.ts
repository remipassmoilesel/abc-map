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

import * as fs from 'fs';
import { MigrationProject } from '../typings';
import { ProjectHelper, Zipper } from '@abc-map/shared';
import { AbcProjectManifest010 } from '../dependencies/010-project-types';
import { AbcProjectManifest030 } from '../dependencies/030-project-types';
import { AbcProjectManifest020 } from '../dependencies/020-project-types';
import { AbcProjectManifest110 } from '../dependencies/110-project-types';
import { AbcProjectManifest090 } from '../dependencies/090-project-types';
import { AbcProjectManifest040 } from '../dependencies/040-project-types';
import { AbcProjectManifest050 } from '../dependencies/050-project-types';
import { AbcProjectManifest060 } from '../dependencies/060-project-types';
import { AbcProjectManifest070 } from '../dependencies/070-project-types';
import { AbcProjectManifest080 } from '../dependencies/080-project-types';
import { AbcProjectManifest100 } from '../dependencies/100-project-types';
import { AbcProjectManifest130 } from '../dependencies/130-project-types';

export class TestData {
  public static async project01(): Promise<MigrationProject<AbcProjectManifest010>> {
    return this.readFile(`${__dirname}/project-0.1.abm2`) as Promise<MigrationProject<AbcProjectManifest010>>;
  }

  public static async project020(): Promise<MigrationProject<AbcProjectManifest020>> {
    return this.readFile(`${__dirname}/project-0.2.0.abm2`) as Promise<MigrationProject<AbcProjectManifest020>>;
  }

  public static async project030(): Promise<MigrationProject<AbcProjectManifest030>> {
    return this.readFile(`${__dirname}/project-0.3.0.abm2`) as Promise<MigrationProject<AbcProjectManifest030>>;
  }

  public static async project040(): Promise<MigrationProject<AbcProjectManifest040>> {
    return this.readFile(`${__dirname}/project-0.4.0.abm2`) as Promise<MigrationProject<AbcProjectManifest040>>;
  }

  public static async project050(): Promise<MigrationProject<AbcProjectManifest050>> {
    return this.readFile(`${__dirname}/project-0.5.0.abm2`) as Promise<MigrationProject<AbcProjectManifest050>>;
  }

  public static async project060(): Promise<MigrationProject<AbcProjectManifest060>> {
    return this.readFile(`${__dirname}/project-0.6.0.abm2`) as Promise<MigrationProject<AbcProjectManifest060>>;
  }

  public static async project070(): Promise<MigrationProject<AbcProjectManifest070>> {
    return this.readFile(`${__dirname}/project-0.7.0.abm2`) as Promise<MigrationProject<AbcProjectManifest070>>;
  }

  public static async project080(): Promise<MigrationProject<AbcProjectManifest080>> {
    return this.readFile(`${__dirname}/project-0.8.0.abm2`) as Promise<MigrationProject<AbcProjectManifest080>>;
  }

  public static async project090(): Promise<MigrationProject<AbcProjectManifest090>> {
    return this.readFile(`${__dirname}/project-0.9.0.abm2`) as Promise<MigrationProject<AbcProjectManifest090>>;
  }

  public static async project100(): Promise<MigrationProject<AbcProjectManifest100>> {
    return this.readFile(`${__dirname}/project-1.0.0.abm2`) as Promise<MigrationProject<AbcProjectManifest100>>;
  }

  public static async project110(): Promise<MigrationProject<AbcProjectManifest110>> {
    return this.readFile(`${__dirname}/project-1.1.0.abm2`) as Promise<MigrationProject<AbcProjectManifest110>>;
  }

  public static async project110_public(): Promise<MigrationProject<AbcProjectManifest110>> {
    return this.readFile(`${__dirname}/project-1.1.0_public.abm2`) as Promise<MigrationProject<AbcProjectManifest110>>;
  }

  public static async project130(): Promise<MigrationProject<AbcProjectManifest130>> {
    return this.readFile(`${__dirname}/project-1.3.0.abm2`) as Promise<MigrationProject<AbcProjectManifest130>>;
  }

  public static fakeProject<T>(version: string): T {
    return { metadata: { version } } as unknown as T;
  }

  private static async readFile(path: string): Promise<MigrationProject<unknown>> {
    const archive = fs.readFileSync(path);
    const files = await Zipper.forNodeJS().unzip(archive);
    const manifest = await ProjectHelper.forNodeJS().extractManifest(archive);
    const blobFiles = files.map((f) => ({ path: f.path, content: new Blob([f.content as Buffer]) }));

    return { manifest, files: blobFiles };
  }
}
