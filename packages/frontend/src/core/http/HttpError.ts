import { AxiosError } from 'axios';

export class HttpError {
  public static isHttpCode(err: AxiosError | Error | undefined, code: number): err is AxiosError {
    return (err && 'response' in err && err.response?.status === code) || false;
  }

  public static isUnauthorized(err: AxiosError | Error | undefined): err is AxiosError {
    return this.isHttpCode(err, 401);
  }

  public static isForbidden(err: AxiosError | Error | undefined): err is AxiosError {
    return this.isHttpCode(err, 403);
  }

  public static isTooManyRequests(err: AxiosError | Error | undefined): err is AxiosError {
    return this.isHttpCode(err, 429);
  }

  public static isTooManyProject(err: AxiosError | Error | undefined): err is AxiosError {
    return this.isHttpCode(err, 402);
  }

  public static isConflict(err: AxiosError | Error | undefined): err is AxiosError {
    return this.isHttpCode(err, 409);
  }
}
