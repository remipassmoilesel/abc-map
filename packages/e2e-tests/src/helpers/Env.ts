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

  public static projectPassword(): string {
    return this.getVar('PROJECT_PASSWORD');
  }

  private static getVar(name: string): string {
    const value = Cypress.env(name);
    const message = `${name} variable must be defined, please check README.md`;
    expect(value, message).not.undefined;
    expect(value, message).not.empty;
    return value;
  }
}
