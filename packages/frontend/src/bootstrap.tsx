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
import { Services } from './core/Services';
import { Logger, UserStatus } from '@abc-map/shared';
import { AxiosError } from 'axios';
import { HttpError } from './core/http/HttpError';
import { BUILD_INFO } from './build-version';
import { render } from './render';
import { MainStore } from './core/store/store';
import { ProjectEventType } from './core/project/ProjectEvent';
import { StyleFactory } from './core/geo/styles/StyleFactory';
import { LoadingStatus, ModuleLoadingFailed } from './data-processing/_common/registry/ModuleLoadingStatus';
import { ModuleRegistry } from './data-processing/_common/registry/ModuleRegistry';
import { UiActions } from './core/store/ui/actions';

export const logger = Logger.get('bootstrap.tsx', 'warn');

export function bootstrap(svc: Services, store: MainStore) {
  logger.info('Version: ', BUILD_INFO);

  return authentication(svc)
    .then(() => render(svc, store))
    .then(() => dispatchVisit(store))
    .then(() => initProject(svc, store))
    .then(() => enableGeolocation(svc, store))
    .then(() => loadRemoteModules(store))
    .catch((err) => bootstrapError(err));
}

/**
 * All users are authenticated, as connected users or as anonymous users
 * @param svc
 */
async function authentication(svc: Services): Promise<void> {
  if (!svc.pwa.isOnline()) {
    return;
  }

  const connected = !!svc.authentication.getUserStatus();
  if (connected) {
    return svc.authentication.renewToken().catch((err) => {
      logger.error('Cannot renew token: ', err);
      return svc.authentication.anonymousLogin();
    });
  }
  // Else we authenticate as anonymous
  else {
    return svc.authentication.anonymousLogin();
  }
}

function dispatchVisit(store: MainStore) {
  store.dispatch(UiActions.incrementVisitCounter());
}

async function initProject({ project, geo, history }: Services, store: MainStore) {
  // When project loaded, we clean style cache and undo/redo history
  project.addProjectLoadedListener((ev) => {
    if (ProjectEventType.ProjectLoaded === ev.type) {
      history.resetHistory();
      StyleFactory.get().clearCache();
    } else {
      logger.error('Unhandled event type: ', ev);
    }
  });

  // When main map move we save view in project
  geo.getMainMap().addViewMoveListener(() => {
    const view = geo.getMainMap().getView();
    project.setView(view);
  });

  // We create a new project or load an existing one
  // We must load an existing one only if user is authenticated
  const prevProject = store.getState().project.metadata;
  const userStatus = store.getState().authentication.userStatus;
  const loadPrivateProject = prevProject.id && !prevProject.public && UserStatus.Authenticated === userStatus;
  const loadPublicProject = prevProject.id && prevProject.public && UserStatus.Authenticated === userStatus;
  try {
    if (loadPrivateProject) {
      await project.loadPrivateProject(prevProject.id);
    } else if (loadPublicProject) {
      await project.loadPublicProject(prevProject.id);
    } else {
      await project.newProject();
    }
  } catch (err) {
    // No need to notify user, a new project is created
    logger.error(`Project init error`, err);
    await project.newProject();
  }
}

// Enable and disable geolocation according to store on the first map display
function enableGeolocation(svc: Services, store: MainStore) {
  const map = svc.geo.getMainMap();
  const geolocationEnabled = store.getState().map.geolocation.enabled;
  const followPosition = store.getState().map.geolocation.followPosition;
  const rotateMap = store.getState().map.geolocation.rotateMap;

  if (geolocationEnabled) {
    map.enableGeolocation();
    map.getGeolocation()?.followPosition(followPosition);
    map.getGeolocation()?.rotateMap(rotateMap);
    map.getGeolocation()?.onNextAccuracyChange(() => map.getGeolocation()?.updateMapView());
  } else {
    map.disableGeolocation();
  }
}

function bootstrapError(err: Error | AxiosError | undefined): void {
  logger.error('Bootstrap error: ', err);

  let message: string;
  if (HttpError.isTooManyRequests(err)) {
    message = 'You have exceeded the number of authorized requests 😭. Please try again later.';
  } else {
    message = 'Small technical issue 😅 Please try again later.';
  }

  const root = document.querySelector('#root');
  if (!root) {
    alert(message);
    return;
  }

  root.innerHTML = `
    <h1 class='text-center my-5'>Abc-Map</h1>
    <h5 class='text-center my-5'>${message}</h5>
  `;
}

async function loadRemoteModules(store: MainStore): Promise<void> {
  const urls = store.getState().ui.remoteModules.map((mod) => mod.url);
  return ModuleRegistry.get()
    .loadRemoteModules(urls)
    .then((statusList) => {
      const errors = statusList.filter((st): st is ModuleLoadingFailed => st.status === LoadingStatus.Failed);
      if (errors.length) {
        logger.error('Some modules where not loaded: ', errors);
      }
    });
}
