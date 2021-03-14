import { ProjectService } from './project/ProjectService';
import { GeoService } from './geo/GeoService';
import { httpExternalClient, httpApiClient, httpDownloadClient } from './http/HttpClients';
import { AuthenticationService } from './authentication/AuthenticationService';
import { HistoryService } from './history/HistoryService';
import { DataService } from './data/DataService';
import { mainStore } from './store/store';
import { ToastService } from './ui/ToastService';
import { ModalService } from './ui/ModalService';

export interface Services {
  project: ProjectService;
  geo: GeoService;
  toasts: ToastService;
  modals: ModalService;
  authentication: AuthenticationService;
  history: HistoryService;
  data: DataService;
}

let instance: Services | undefined;
export function services(): Services {
  if (!instance) {
    instance = serviceFactory();
  }
  return instance;
}

function serviceFactory(): Services {
  const jsonClient = httpApiClient(5_000);
  const downloadClient = httpDownloadClient(5_000);
  const externalClient = httpExternalClient(5_000);

  const modals = new ModalService();
  const toasts = new ToastService();
  const history = HistoryService.create();
  const geo = new GeoService(externalClient, history);
  const project = new ProjectService(jsonClient, downloadClient, mainStore, geo, modals, history);
  const authentication = new AuthenticationService(jsonClient, mainStore, toasts);
  const data = new DataService(jsonClient, downloadClient, geo);

  return {
    project,
    geo,
    modals,
    toasts,
    authentication,
    history,
    data,
  };
}
