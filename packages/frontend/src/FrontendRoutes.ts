export class FrontendRoutes {
  public static landing(): string {
    return '/';
  }

  public static map(): string {
    return '/map';
  }

  public static dataStore(): string {
    return '/datastore';
  }

  public static layout(): string {
    return '/layout';
  }

  public static settings(): string {
    return '/settings';
  }

  public static help(): string {
    return '/help';
  }

  public static about(): string {
    return '/about';
  }

  public static confirmAccount() {
    return '/confirm-account/:userId';
  }
}

export interface ConfirmAccountParams {
  userId?: string;
}
