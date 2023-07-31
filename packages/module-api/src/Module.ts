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

import { LazyExoticComponent, ReactElement } from 'react';

export type ModuleFactory = () => Module;

export type ModuleId = string;

export interface Module {
  /**
   * Returns the unique id of this module. You should use your module name and a random part, per example:
   * ```
   *    my-awesome-module-36b98e4026b05
   * ```
   */
  getId(): ModuleId;

  /**
   * Return the name that should be displayed in user interface
   */
  getReadableName(): string;

  /**
   * Return the description that should be displayed in user interface.
   *
   * Will be displayed as text.
   *
   * Description is used for searches too.
   */
  getShortDescription(): string;

  /**
   * User interface of module
   */
  getView(): ReactElement | LazyExoticComponent<any>;
}

export abstract class ModuleAdapter implements Module {
  public abstract getId(): ModuleId;

  public abstract getReadableName(): string;

  public abstract getShortDescription(): string;

  public abstract getView(): ReactElement | LazyExoticComponent<any>;
}
