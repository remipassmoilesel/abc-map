import * as CircularJSON from 'circular-json';

export class DevUtils {
    public static safeStringify(data: any) {
        return CircularJSON.stringify(data);
    }
}