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
import { errorMessage, Logger, UserStatus } from '@abc-map/shared';
import { AxiosError } from 'axios';
import { HttpError } from './core/http/HttpError';
import { VERSION } from './version';
import { render } from './render';
import { MainStore } from './core/store/store';
import { ProjectEventType } from './core/project/ProjectEvent';
import { StyleFactory } from './core/geo/styles/StyleFactory';
import { ModuleRegistry } from './core/modules/registry/ModuleRegistry';
import { UiActions } from './core/store/ui/actions';
import React from 'react';
import { initProjectDatabase } from './core/storage/project-storage/projects-database';
import { Routes } from './routes';
import { matchRoutes } from 'react-router-dom';

export const logger = Logger.get('bootstrap.tsx');

export function bootstrap(svc: Services, store: MainStore) {
  logger.info('Version: ', VERSION);

  return setGlobals()
    .then(() => authentication(svc))
    .then(() => initializeModules())
    .then(() => render(svc, store))
    .then(() => dispatchVisit(store))
    .then(() => initProject(svc, store))
    .then(() => enableGeolocation(svc, store))
    .catch((err) => bootstrapError(err));
}

async function setGlobals() {
  // We keep a global reference of our instance of React in order to use it in remote modules
  // See https://github.com/facebook/react/issues/13991 and related issues
  // Reference must be lower case
  type HasReact = Window & { react?: typeof React };
  (window as HasReact).react = React;
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

async function initProject(services: Services, store: MainStore) {
  const { project: projectService, geo, history, authentication } = services;

  await initProjectDatabase();

  // When project loaded, we clean style cache and undo/redo history
  projectService.addProjectLoadedListener((ev) => {
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
    projectService.setView(view);
  });

  const isSharedMapRoute = matchRoutes([{ path: Routes.sharedMap().raw() }], window.location);

  // If we are displaying a shared map, we do not need to load a project, project will be loaded by SharedMapView
  // We initialize a new project because in app we assume that a project is always loaded
  if (isSharedMapRoute) {
    await projectService.newProject();
  }

  // A project may have been stored locally or remotely, we load it if any
  else {
    const prevProject = store.getState().project.metadata;
    if (await projectService.isStoredLocally(prevProject.id)) {
      try {
        await projectService.loadLocalProject(prevProject.id);
      } catch (err) {
        logger.error(`Local project init error:`, err);
        await projectService.newProject();
      }
    }
    // Otherwise we try to find it online
    else {
      // We create a new project or load an existing one
      // We must load an existing one only if user is authenticated
      const userIsAuthenticated = authentication.getUserStatus() === UserStatus.Authenticated;
      try {
        if (userIsAuthenticated) {
          await projectService.loadRemotePrivateProject(prevProject.id);
        } else {
          await projectService.newProject();
        }
      } catch (err) {
        // No need to notify user, a new project is created
        logger.error(`Remote project init error:`, err);
        await projectService.newProject();
      }
    }
  }

  // We must not save before project loading
  projectService.enableProjectAutoSave();
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

function bootstrapError(err: Error | AxiosError | undefined): Promise<void> {
  logger.error('Bootstrap error: ', err);

  let message: string;
  if (HttpError.isTooManyRequests(err)) {
    message = 'You have exceeded the number of authorized requests 😭. Please try again later.';
  } else {
    message = 'Small technical issue 😅 Please try again later.';
  }

  const root = document.querySelector('#root');
  if (root) {
    root.innerHTML = `
    <h1 class='text-center my-5'>Abc-Map</h1>
    <h5 class='text-center my-5'>${message}</h5>
  `;
  } else {
    alert(message);
  }

  return Promise.reject(err ?? new Error(errorMessage(err)));
}

async function initializeModules(): Promise<void> {
  await ModuleRegistry.get().initialize();
}
