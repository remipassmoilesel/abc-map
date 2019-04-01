
export enum LSKey {
    CURRENT_PROJECT_ID = "ABC_CURRENT_PROJECT"
}

export class AbcLocalStorageHelper {

    public save(key: LSKey, value: string): void {
        localStorage.setItem(key, value);
    }

    public get(key: LSKey): string | null {
        return localStorage.getItem(key);
    }

}

export const abcLocalst = new AbcLocalStorageHelper();
