import * as path from 'path';

export class Config {
  public getProjectRoot(): string {
    return path.resolve(__dirname, '..', '..', '..');
  }

  public getBackendRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/backend');
  }

  public getCliRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/abc-cli');
  }

  public getDevServicesRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/infrastructure/dev-services');
  }

  public getE2eRoot(): string {
    return path.resolve(this.getProjectRoot(), 'packages/e2e-tests');
  }

  public getFrontendE2eUrl(): string {
    return 'http://localhost:3005';
  }

  public getBackendE2eUrl(): string {
    return 'http://localhost:10082/api/health';
  }
}
