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

export enum Command {
  INSTALL = 'install',
  LINT = 'lint',
  BUILD = 'build',
  TEST = 'test',
  E2E = 'e2e',
  WATCH = 'watch',
  CI = 'ci',
  START = 'start',
  START_SERVICES = 'start-services',
  STOP_SERVICES = 'stop-services',
  CLEAN_RESTART_SERVICES = 'clean-restart-services',
  CLEAN = 'clean',
  DEPENDENCY_CHECK = 'dep-check',
  NPM_REGISTRY = 'npm-registry',
  HELP = 'help',
}
