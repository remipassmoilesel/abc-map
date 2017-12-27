import {Utils} from '../utils/Utils';

export class LogLevel {

    public static DEBUG = new LogLevel('DEBUG', 0);
    public static INFO = new LogLevel('INFO', 1);
    public static WARNING = new LogLevel('WARNING', 2);
    public static ERROR = new LogLevel('ERROR', 3);

    public level: string;
    public weight: number;

    constructor(level: string, levelNbr: number) {
        this.level = level;
        this.weight = levelNbr;
    }
}

// TODO: add environment variable for log level ?
const defaultLogLevel = LogLevel.INFO;

export class Logger {

    private level: LogLevel = defaultLogLevel;
    private namespace: string;

    public static getLogger(namespace: string) {
        return new Logger(namespace);
    }

    constructor(namespace: string) {
        this.namespace = namespace;
    }

    public debug(message: string, data?: any) {
        this.print(message, LogLevel.DEBUG, data);
    }

    public info(message: string, data?: any) {
        this.print(message, LogLevel.INFO, data);
    }

    public warning(message: string, data?: any) {
        this.print(message, LogLevel.WARNING, data);
    }

    public error(message: string, data?: any) {
        this.print(message, LogLevel.ERROR, data);
    }

    public setLevel(level: LogLevel) {
        this.level = level;
    }

    private print(msg: string, level: LogLevel, data?: any) {

        if (level.weight >= this.level.weight) {
            const stringifiedData = data ? Utils.safeStringify(data, 2) : '';
            const date = new Date().toString().substr(16, 8);
            console.log(`[${date}] [${level}] [${this.namespace}] ${msg} ${stringifiedData}`);
        }
    }

}
