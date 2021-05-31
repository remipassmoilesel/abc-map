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

export class ProjectConstants {
  /**
   * Maximum size of project for uploads, in bytes
   */
  public static readonly MaxSizeBytes = 5 * 1024 * 1024;

  /**
   * Version of project, not used for the moment but will be useful for data migrations
   */
  public static readonly CurrentVersion = '0.1';

  /**
   * Name of main data file in project archive
   */
  public static readonly ManifestName = 'project.json';
}
