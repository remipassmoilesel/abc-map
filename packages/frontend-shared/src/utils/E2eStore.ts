import { AbcLayout } from '@abc-map/shared-entities';

export interface E2eStore {
  getState(): E2eState;
}

export interface E2eState {
  project: {
    layouts: AbcLayout[];
  };
}
