import * as path from 'path';
import * as fs from 'fs';

export interface IApiConfig {
    environmentName: string;
    httpPort: number;
    sessionSecret: string;
    jwtSecret: string;
    frontend: {
        rootPath: string;
    };
    fileUpload: {
        maxJsonBody: string;
        maxFilesPerUpload: number;
        maxSizePerFile: number;
    };
    publicDir: {
        rootPath: string;
    };
    mongodb: {
        host: string;
        port: number;
        databaseName: string;
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

    public static async load(): Promise<IApiConfig> {
        const env = this.getEnvVariableOrDefault;
        const envName = env('ABC_ENVIRONMENT', 'production');
        // tslint:disable:max-line-length
        const result: IApiConfig = {
            environmentName: envName,
            httpPort: env('ABC_HTTP_PORT', 32158),
            sessionSecret: env('ABC_SESSION_SECRET', '2b3e0e5143b9c1bfcd7bde91051b16b6a07c19467a53991095226e993462a6431b'),
            jwtSecret: env('ABC_JWT_SECRET', 'f5098e123bf45e762473e6761c990f5598c4c57241cd1bc099aa110a51dfb013b8e'),
            frontend: {
                rootPath: path.resolve(__dirname, '..', 'gui-dist'),
            },
            fileUpload: {
                maxJsonBody: env('ABC_MAX_JSON_BODY', '20mb'),
                maxFilesPerUpload: parseInt(env('ABC_MAX_FILES_PER_UPLOAD', 10), 10),
                maxSizePerFile: parseInt(env('ABC_MAX_SIZE_PER_FILE_B', 1e+7), 10),
            },
            publicDir: {
                rootPath: path.resolve(__dirname, '..', '..', 'data/public'),
            },
            mongodb: {
                host: env('ABC_MONGODB_HOST', 'localhost'),
                port: env('ABC_MONGODB_PORT', 27017),
                databaseName: `abcmap-${envName}`,
            },
            minio: {
                endPoint: env('ABC_MINIO_HOST', 'localhost'),
                port: 9000,
                useSSL: false,
                accessKey: env('ABC_MINIO_ACCESS_KEY', 'fb37ca0b53f49587c534be53281a9f94a865d6cedb1e205c1f057810'),
                secretKey: env('ABC_MINIO_ACCESS_KEY', 'ea6dd22b3cd0c3908b0e59c4e769a0abff1c4d0081585fa5ea6dd22b3cd0c3908b0e59c4e769a0abff1c4d0081585fa5'),
            },
        };
        // tslint:enable:max-line-length

        if (!fs.existsSync(result.publicDir.rootPath)) {
            return Promise.reject(`Not a directory: ${result.publicDir.rootPath}`);
        }

        return result;
    }

    private static getEnvVariableOrDefault(envVarName: string, defaultValue: any): any {
        return process.env[envVarName] || defaultValue;
    }
}

