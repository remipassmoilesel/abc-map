export declare type Params = { [k: string]: string | undefined };

export function routeReplace(route: string, params: Params): string {
  let result = route;
  for (const key in params) {
    const value = params[key];
    if (typeof value !== 'undefined') {
      result = result.replace(new RegExp(`:${key}\\??`), value);
    }
  }
  return result;
}
