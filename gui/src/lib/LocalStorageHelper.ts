
export enum LSKey {
    CURRENT_PROJECT_ID = "ABC_CURRENT_PROJECT"
}

export class LocalStorageHelper {

    public save(key: LSKey, value: string): void {
        localStorage.setItem(key, value);
    }

    public get(key: LSKey): string | null {
        return localStorage.getItem(key);
    }

}
