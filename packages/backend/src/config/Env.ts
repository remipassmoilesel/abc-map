export enum EnvKey {
  CONFIG = 'ABC_CONFIGURATION',
}

export class Env {
  public get(key: EnvKey): string | undefined {
    return process.env[key];
  }
}
