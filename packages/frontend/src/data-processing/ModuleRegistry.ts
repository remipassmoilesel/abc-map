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

import { getServices } from '../core/Services';
import * as react from 'react';
import { Module, ModuleFactory } from '@abc-map/module-api';
import { mainStore, MainStore } from '../core/store/store';
import { DataViewer } from './data-viewer/DataViewer';
import { ColorGradients } from './color-gradients/ColorGradients';
import { ProportionalSymbols } from './proportional-symbols/ProportionalSymbols';
import { DifferentSymbols } from './different-symbols/DifferentSymbols';
import { FeatureCountByGeometries } from './count-by-geometries/FeatureCountByGeometries';
import { Scripts } from './scripts/Scripts';
import { isExperimentalFeatureEnabled } from '../core/ui/useExperimentalFeature';
import { ArtefactGenerator } from '../experimental-features';
import { ArtefactGenerator as ArtefactGeneratorModule } from './artefact-generator/ArtefactGenerator';
import { RemoteModuleLoader } from './remote-module-loader/RemoteModuleLoader';
import { UiActions } from '../core/store/ui/actions';
import { Logger } from '@abc-map/shared';
import { errorMessage } from '../core/utils/errorMessage';
import { LoadingStatus, ModuleLoadingFailed, ModuleLoadingStatus, ModuleLoadingSucceed } from './ModuleLoadingStatus';
import { getModuleApi } from './getModuleApi';

const logger = Logger.get('ModuleRegistry.ts');

let instance: ModuleRegistry | undefined;

export class ModuleRegistry {
  public static get(): ModuleRegistry {
    if (!instance) {
      instance = new ModuleRegistry(mainStore);
    }

    return instance;
  }

  private remoteModules: Module[] = [];
  private localModules: Module[] = [];

  constructor(private store: MainStore) {
    this.resetLocalModules();
  }

  public getAllModules() {
    return this.localModules.concat(ModuleRegistry.get().getRemoteModules());
  }

  public getRemoteModules() {
    return this.remoteModules;
  }

  public isRemote(module: Module): boolean {
    return !!this.remoteModules.find((mod) => mod.getId() === module.getId());
  }

  public resetLocalModules() {
    const services = getServices();
    this.localModules = [
      new DataViewer(),
      new ColorGradients(services),
      new ProportionalSymbols(services),
      new DifferentSymbols(),
      new FeatureCountByGeometries(),
      new Scripts(services),
      new RemoteModuleLoader(services, mainStore, this.loadRemoteModules),
    ];

    if (isExperimentalFeatureEnabled(ArtefactGenerator)) {
      this.localModules.push(ArtefactGeneratorModule.create(services));
    }

    this.updateUi();
  }

  public loadRemoteModules = (): Promise<ModuleLoadingStatus[]> => {
    const remoteUrls = this.store.getState().ui.remoteModuleUrls;
    return Promise.all(
      remoteUrls.map((url) =>
        this.load(url)
          .then<ModuleLoadingSucceed>(() => {
            logger.info(`Module ${url} loaded`);
            return { status: LoadingStatus.Succeed, url };
          })
          .catch<ModuleLoadingFailed>((err) => {
            return { status: LoadingStatus.Failed, url, error: errorMessage(err) };
          })
      )
    ).then((statusList) => {
      // Keep loaded URL in store
      const urls = statusList.filter((st): st is ModuleLoadingSucceed => st.status === LoadingStatus.Succeed).map((st) => st.url);
      this.store.dispatch(UiActions.setRemoteModuleUrls(urls));

      // Update UI
      this.updateUi();

      return statusList;
    });
  };

  public async load(_url: string): Promise<Module> {
    const url = _url.replace(new RegExp('/$', 'i'), '');

    // We fetch module code
    const jsCode = await fetch(`${url}/module.js`).then((res) => res.text());

    // We will add header in order to inject a require function and api
    // Header must be one line and placed on the first line of eval, in order to prevent source map shifts
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

    // Source map URL is relative, we will replace it
    const jsCodeCorrected = jsCode.replace('//# sourceMappingURL=module.js.map', '');

    const footer = `
            //# sourceMappingURL=${url}/module.js.map
            return exports.module.default;
        }
      `
      .split('\n')
      .map((s) => s.trim())
      .join('\n');

    // We must share react with modules, otherwise hooks will be unusable
    // FIXME: find a better way, per example share react as global reference
    const requireProxy = function (name: string) {
      switch (name) {
        case 'react':
          return react;
        case 'sinon':
          return {};
        default:
          throw new Error(`Module not found: ${name}`);
      }
    };

    const api = getModuleApi();

    // WARNING: if you add a line in eval(), you will break module source maps.
    // eslint-disable-next-line no-eval
    const moduleFactory: ModuleFactory = eval(`${header}${jsCodeCorrected};\n${footer}`)(requireProxy, api);

    if (typeof moduleFactory !== 'function') {
      return Promise.reject(new Error('Not a function'));
    }

    const module = moduleFactory();
    // We remove previous modules
    this.remoteModules = this.remoteModules.filter((mod) => mod.getId() !== module.getId());

    // We add module to remotes, then reset module list
    this.remoteModules.push(module);

    this.updateUi();
    return module;
  }

  private updateUi() {
    const moduleIds = this.localModules.concat(this.remoteModules).map((mod) => mod.getId());
    this.store.dispatch(UiActions.setLoadedModules(moduleIds));
  }
}
