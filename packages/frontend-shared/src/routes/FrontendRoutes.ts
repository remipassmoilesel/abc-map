import { routeReplace } from './routeReplace';

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

  public static help(): string {
    return '/help';
  }

  public static about(): string {
    return '/about';
  }

  public static confirmAccount(userId?: string) {
    return routeReplace('/confirm-account/:userId', { userId });
  }

  public static dataProcessing(moduleId?: string) {
    return routeReplace('/data-processing/:moduleId?', { moduleId });
  }
}

export interface ConfirmAccountParams {
  userId?: string;
}

export interface DataProcessingParams {
  moduleId?: string;
}
