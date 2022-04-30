export enum LoadingStatus {
  Succeed = 'Succeed',
  Failed = 'Failed',
}

export interface ModuleLoadingSucceed {
  status: LoadingStatus.Succeed;
  url: string;
}

export interface ModuleLoadingFailed {
  status: LoadingStatus.Failed;
  url: string;
  error: string;
}

export type ModuleLoadingStatus = ModuleLoadingSucceed | ModuleLoadingFailed;
