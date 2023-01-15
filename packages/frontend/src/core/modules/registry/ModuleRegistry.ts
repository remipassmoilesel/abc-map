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

import { getServices, Services } from '../../../core/Services';
import { Module, ModuleFactory } from '@abc-map/module-api';
import { mainStore, MainStore } from '../../../core/store/store';
import { errorMessage, Logger } from '@abc-map/shared';
import { LoadingStatus, ModuleLoadingFailed, ModuleLoadingStatus, ModuleLoadingSucceed } from './ModuleLoadingStatus';
import { getModuleApi } from './getModuleApi';
import Fuse from 'fuse.js';
import { ModuleIndexItem } from './ModuleIndexItem';
import { isRemoteModule, RemoteModule, RemoteModuleWrapper } from './RemoteModule';
import { localModulesFactory } from '../../../modules';
import { UiActions } from '../../store/ui/actions';

const logger = Logger.get('ModuleRegistry.ts');

export type LocalModulesFactory = (services: Services, store: MainStore) => Module[];

let instance: ModuleRegistry | undefined;

export class ModuleRegistry {
  public static get(): ModuleRegistry {
    if (!instance) {
      instance = new ModuleRegistry(getServices(), mainStore, localModulesFactory);
    }

    return instance;
  }

  private modules: Module[] = [];
  private moduleIndex: Fuse<ModuleIndexItem> | undefined;
  private eventTarget = document.createDocumentFragment();

  /**
   * You should use getModuleRegistry()
   *
   * @param services
   * @param store
   * @param localModuleFactory
   */
  constructor(private services: Services, private store: MainStore, private localModuleFactory: LocalModulesFactory) {}

  /**
   * Initialize registry by loading local and remote modules.
   *
   * If remote module loading fail, method will not fail.
   */
  public async initialize() {
    // We keep remote URLs in memory
    const remoteUrls = this.store.getState().ui.remoteModuleUrls;

    // We initialize local modules
    this.modules = localModulesFactory(this.services);

    // Then we load remote modules if any
    if (remoteUrls.length) {
      const statusList = await this.loadRemoteModules(remoteUrls);
      const errors = statusList.filter((st): st is ModuleLoadingFailed => st.status === LoadingStatus.Failed);
      if (errors.length) {
        logger.error('Some modules where not loaded: ', errors);
      }
    }
    // Otherwise we trigger a module update for indexes
    else {
      this.updateModules(this.modules);
    }
  }

  /**
   * This method removes all remote modules and restore default local modules
   *
   */
  public resetModules() {
    const modules = this.localModuleFactory(this.services, this.store);
    this.updateModules(modules);
  }

  public getModules(): Module[] {
    return this.modules;
  }

  public getRemoteModules(): RemoteModule[] {
    return this.modules.filter(isRemoteModule);
  }

  public search(query: string): Module[] {
    if (!this.moduleIndex) {
      logger.error('Search not ready');
      return [];
    }

    return this.moduleIndex.search(query).map((item) => item.item.module);
  }

  // FIXME: Use ES modules when Webpack ES6 output will be stable, or change bundler
  // FIXME: See: https://webpack.js.org/configuration/output/#module-definition-systems
  public async loadRemoteModule(_url: string): Promise<Module> {
    const url = _url.replace(new RegExp('/$', 'i'), '');

    // We fetch module code
    const jsCode = await fetch(`${url}/module.js`).then((res) => res.text());

    // We wrap module code with a function body to pass arguments (api)
    // It must be one lined and placed on the first line of eval, in order to prevent source map shifts
    const header = `
        (require, api) => {
            const moduleApi = {
              ...api,
              resourceBaseUrl: '${url}/',
            };
            const exports = {};
      `
      .split('\n')
      .map((s) => s.trim())
      .join('');

    // By default source map URL is relative, we replace it
    const jsCodeCorrected = jsCode.replace('//# sourceMappingURL=module.js.map', '');

    const footer = `
            //# sourceMappingURL=${url}/module.js.map
            return exports.module.default;
        }
      `
      .split('\n')
      .map((s) => s.trim())
      .join('\n');

    const api = getModuleApi();

    // We use a noops require function, modules must be autonomous
    const require = function (...args: any[]) {
      logger.warn('WARNING: a module calls require(), nothing will happen. Arguments: ', args);
    };

    // WARNING: if you add a line in eval(), you will break module source maps.
    // eslint-disable-next-line no-eval
    const moduleFactory: ModuleFactory = eval(`${header}${jsCodeCorrected};\n${footer}`)(require, api);

    if (typeof moduleFactory !== 'function') {
      return Promise.reject(new Error('Not a function'));
    }

    const module = moduleFactory();

    // We remove previous instances then add it to module list
    const modules = this.modules.filter((mod) => mod.getId() !== module.getId());
    modules.push(new RemoteModuleWrapper(module, url));
    this.updateModules(modules);

    return module;
  }

  public unload(module: Module) {
    const modules = this.modules.filter((mod) => mod.getId() !== module.getId());
    this.updateModules(modules);
  }

  public async loadRemoteModules(urls: string[]): Promise<ModuleLoadingStatus[]> {
    return Promise.all(
      urls.map((url) =>
        this.loadRemoteModule(url)
          .then<ModuleLoadingSucceed>((module) => {
            logger.info(`Module ${url} loaded`);
            return { status: LoadingStatus.Succeed, url, module };
          })
          .catch<ModuleLoadingFailed>((err) => {
            return { status: LoadingStatus.Failed, url, error: errorMessage(err), module: undefined };
          })
      )
    );
  }

  private updateModules(modules: Module[]): void {
    this.modules = modules;

    // Update remote modules URL list
    const remoteUrls = this.modules.filter(isRemoteModule).map((m) => m.getSourceUrl());
    this.store.dispatch(UiActions.setRemoteModuleUrls(remoteUrls));

    this.updateSearchIndex();

    this.eventTarget.dispatchEvent(new CustomEvent('change'));
  }

  public updateSearchIndex(): void {
    // Build module index for searches
    const indexItems: ModuleIndexItem[] = this.modules.map((mod) => ({
      module: mod,
      name: mod.getReadableName(),
      shortDescription: mod.getShortDescription(),
      // We need ids for end to end tests
      id: mod.getId(),
    }));
    const options: Fuse.IFuseOptions<ModuleIndexItem> = {
      includeScore: true,
      keys: ['name', 'shortDescription', 'fullDescription', 'id'],
    };

    this.moduleIndex = new Fuse(indexItems, options);
  }

  public addEventListener(listener: () => void): void {
    this.eventTarget.addEventListener('change', listener);
  }

  public removeEventListener(listener: () => void): void {
    this.eventTarget.removeEventListener('change', listener);
  }
}
