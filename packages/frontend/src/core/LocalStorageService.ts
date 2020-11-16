export enum StorageKey {
  REDUX_STATE = 'ABC_MAP_STATE',
}

export class LocalStorageService {
  public get(key: StorageKey): string | null {
    return localStorage.getItem(key);
  }

  public set(key: StorageKey, value: string): void {
    localStorage.setItem(key, value);
  }
}
