import {Utils} from '../utils/Utils';

// TODO: add default log level,
// TODO: add ability to set level on logger

export class Logger {

    public static INFO: string = 'INFO';
    public static WARNING: string = 'WARNING';
    public static ERROR: string = 'ERROR';

    private namespace: string;

    public static getLogger(namespace: string) {
        return new Logger(namespace);
    }

    constructor(namespace: string) {
        this.namespace = namespace;
    }

    public info(message: string, data?: any) {
        this.print(message, Logger.INFO, data);
    }

    public warning(message: string, data?: any) {
        this.print(message, Logger.WARNING, data);
    }

    public error(message: string, data?: any) {
        this.print(message, Logger.ERROR, data);
    }

    private print(msg: string, level: string = Logger.INFO, data?: any) {
        const stringifiedData = data ? Utils.safeStringify(data, 2) : '';
        const date = new Date().toString().substr(16, 8);
        console.log(`[${date}] [${level}] [${this.namespace}] ${msg} ${stringifiedData}`);
    }

}
