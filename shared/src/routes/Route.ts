import * as _ from 'lodash';

declare interface IArgMap {
    [k: string]: string;
}

export class Route {

    constructor(public readonly path: string) {

    }

    public withArgs(args: IArgMap): Route {
        const newPath = this.replaceArguments(args, this.path);
        return new Route(newPath);
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
