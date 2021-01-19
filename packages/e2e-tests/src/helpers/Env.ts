export class Env {
  public static wmsUrl(): string {
    return this.getVar('WMS_URL');
  }

  public static wmsUsername(): string {
    return this.getVar('WMS_USERNAME');
  }

  public static wmsPassword(): string {
    return this.getVar('WMS_PASSWORD');
  }

  private static getVar(name: string): string {
    const value = Cypress.env(name);
    expect(value, name + ' variable must be defined, please check README.md').not.undefined;
    return value;
  }
}
