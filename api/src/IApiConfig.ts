
import * as path from 'path';

export interface IApiConfig {
    httpPort: number;
    sessionSecret: string;
    jwtSecret: string;
    frontend: {
        rootPath: string;
    };
    mongodb: {
        host: string;
        port: number;
    };
    minio: {
        endPoint: string,
        port: number,
        useSSL: boolean,
        accessKey: string,
        secretKey: string,
    };
}

// TODO: variabilize secrets

export class ApiConfigHelper {

    public static load(): IApiConfig {
        const env = this.getEnvVariableOrDefault;
        // tslint:disable:max-line-length
        return {
            httpPort: env('ABC_HTTP_PORT', 32158),
            sessionSecret: env('ABC_SESSION_SECRET', '2b3e0e5143b9c1bfcd7bde91051b16b6a07c19467a53991095226e993462a6431b'),
            jwtSecret: env('ABC_JWT_SECRET', 'f5098e123bf45e762473e6761c990f5598c4c57241cd1bc099aa110a51dfb013b8e'),
            frontend: {
                rootPath: path.resolve(__dirname, '..', 'gui-dist'),
            },
            mongodb: {
                host: env('ABC_MONGODB_HOST', 'localhost'),
                port: env('ABC_MONGODB_PORT', 27017),
            },
            minio: {
                endPoint: env('ABC_MINIO_HOST', 'localhost'),
                port: 9001,
                useSSL: false,
                accessKey: env('ABC_MINIO_ACCESS_KEY', 'fb37ca0b53f49587c534be53281a9f94a865d6cedb1e205c1f057810'),
                secretKey: env('ABC_MINIO_ACCESS_KEY', 'ea6dd22b3cd0c3908b0e59c4e769a0abff1c4d0081585fa5ea6dd22b3cd0c3908b0e59c4e769a0abff1c4d0081585fa5'),
            },
        };
        // tslint:enable:max-line-length
    }

    private static getEnvVariableOrDefault(envVarName: string, defaultValue: any): any {
        return process.env[envVarName] || defaultValue;
    }
}

