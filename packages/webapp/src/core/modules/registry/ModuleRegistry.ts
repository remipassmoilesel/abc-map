/**
 * Copyright © 2026 Rémi Pace.
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

import type { Services } from '../../../core/Services';
import { getServices } from '../../../core/Services';
import type { MainStore } from '../../../store/store';
import { mainStore } from '../../../store/store';
import { Logger } from '@abc-map/shared';
import { bundledModulesFactory } from '../../../modules';
import { SearchIndex } from '../../utils/SearchIndex';
import type { AbcModule } from '../../../modules/AbcModule.ts';

const logger = Logger.get('ModuleRegistry.ts');

export type BundledModulesFactory = (services: Services, store: MainStore) => AbcModule[];

let instance: ModuleRegistry | undefined;

export class ModuleRegistry {
  public static get(): ModuleRegistry {
    if (!instance) {
      instance = new ModuleRegistry(getServices(), mainStore, bundledModulesFactory);
    }

    return instance;
  }

  private modules: AbcModule[] = [];
  private moduleIndex?: SearchIndex<AbcModule>;

  private eventTarget = document.createDocumentFragment();

  /**
   * You should use getModuleRegistry()
   *
   * @param services
   * @param store
   * @param bundledModulesFactory
   */
  constructor(
    private services: Services,
    private store: MainStore,
    private bundledModulesFactory: BundledModulesFactory,
  ) {}

  /**
   * Initialize registry by loading local and remote modules.
   *
   * If remote module loading fail, method will not fail.
   */
  public async initialize() {
    // We initialize local modules
    this.modules = bundledModulesFactory(this.services);

    // We trigger a module update for indexes
    this.updateModules(this.modules);
  }

  public getModules(): AbcModule[] {
    return this.modules;
  }

  public search(query: string): AbcModule[] {
    if (!this.moduleIndex) {
      logger.error('Search not ready');
      return [];
    }

    return this.moduleIndex.search(query);
  }

  private updateModules(modules: AbcModule[]): void {
    this.modules = modules;

    this.updateSearchIndex();

    this.eventTarget.dispatchEvent(new CustomEvent('change'));
  }

  public updateSearchIndex(): void {
    const indexify = (m: AbcModule) => [m.getReadableName(), m.getShortDescription(), m.getId()];
    this.moduleIndex = new SearchIndex(this.modules, indexify);
  }

  public addEventListener(listener: () => void): void {
    this.eventTarget.addEventListener('change', listener);
  }

  public removeEventListener(listener: () => void): void {
    this.eventTarget.removeEventListener('change', listener);
  }
}
