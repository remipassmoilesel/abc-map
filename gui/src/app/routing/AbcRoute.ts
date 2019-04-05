import * as _ from 'lodash';

export interface IArgMap {
  [k: string]: string;
}

export class AbcRoute {

  constructor(public readonly path: string) {

  }

  public link(): string {
    return this.withRoot().toString();
  }

  public withRoot(): AbcRoute {
    return new AbcRoute('/' + this.path);
  }

  public withArgs(args: IArgMap): AbcRoute {
    const newPath = this.replaceArguments(args, this.path);
    return new AbcRoute(newPath);
  }

  public toString() {
    return this.path;
  }

  private replaceArguments(args: IArgMap, oldPath: string): string {
    let result = oldPath;
    _.forEach(args, (value: string, key: string) => {
      this.throwIfArgumentNotPresent(key, oldPath);
      result = result.replace(':' + key, value);
    });
    return result;
  }

  private throwIfArgumentNotPresent(key: string, path: string): void {
    if (path.search(':' + key) === -1) {
      throw new Error(`Arg not found arg=:${key} path=${path}`);
    }
  }

}
