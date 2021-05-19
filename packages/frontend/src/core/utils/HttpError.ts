import { AxiosError } from 'axios';

export class HttpError {
  public static isUnauthorized(err: AxiosError | Error | undefined): boolean {
    return (err && 'response' in err && err.response?.status === 401) || false;
  }

  public static isForbidden(err: AxiosError | Error | undefined): boolean {
    return (err && 'response' in err && err.response?.status === 403) || false;
  }

  public static isTooManyRequests(err: AxiosError | Error | undefined): boolean {
    return (err && 'response' in err && err.response?.status === 429) || false;
  }
}
