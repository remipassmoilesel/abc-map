import { ProjectService } from './project/ProjectService';
import { GeoService } from './geo/GeoService';
import { httpExternalClient, httpApiClient, httpDownloadClient } from './http/HttpClients';
import { AuthenticationService } from './authentication/AuthenticationService';
import { HistoryService } from './history/HistoryService';
import { DataStoreService } from './data/DataStoreService';
import { mainStore } from './store/store';
import { ToastService } from './ui/ToastService';
import { ModalService } from './ui/ModalService';
import { AxiosError } from 'axios';

export interface Services {
  project: ProjectService;
  geo: GeoService;
  toasts: ToastService;
  modals: ModalService;
  authentication: AuthenticationService;
  history: HistoryService;
  dataStore: DataStoreService;
}

let instance: Services | undefined;
export function getServices(): Services {
  if (!instance) {
    instance = serviceFactory();
  }
  return instance;
}

function serviceFactory(): Services {
  const toasts = new ToastService();

  const jsonClient = httpApiClient(5_000, (err) => httpErrorHandler(err, toasts));
  const downloadClient = httpDownloadClient(5_000, (err) => httpErrorHandler(err, toasts));
  const externalClient = httpExternalClient(5_000);

  const modals = new ModalService();
  const history = HistoryService.create();
  const geo = new GeoService(externalClient, history);
  const project = new ProjectService(jsonClient, downloadClient, mainStore, geo);
  const authentication = new AuthenticationService(jsonClient, mainStore, toasts);
  const data = new DataStoreService(jsonClient, downloadClient, geo);

  return {
    project,
    geo,
    modals,
    toasts,
    authentication,
    history,
    dataStore: data,
  };
}

function httpErrorHandler(e: AxiosError, toasts: ToastService) {
  if (e.code === '401') {
    toasts.error('Vous devez vous reconnecter.');
  }
  if (e.code === '403') {
    toasts.error('Cette opération est interdite.');
  }

  return Promise.reject(e);
}
