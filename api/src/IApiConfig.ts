export interface IApiConfig {
    httpPort: number;
    sessionSecret: string;
    jwtSecret: string;
    mongodb: {
        port: number;
    };
}

export class ApiConfigHelper {

    public static load(): IApiConfig {
        const env = this.getEnvVariableOrDefault;
        // tslint:disable:max-line-length
        return {
            httpPort: env('ABC_HTTP_PORT', 32158),
            sessionSecret: env('ABC_SESSION_SECRET', '2b3e0e5143b9c1bfcd7bde91051b16b6a07c19467a53991095226e993462a6431b'),
            jwtSecret: env('ABC_JWT_SECRET', 'f5098e123bf45e762473e6761c990f5598c4c57241cd1bc099aa110a51dfb013b8e'),
            mongodb: {
                port: env('ABC_MONGODB_PORT', 27017),
            },
        };
        // tslint:enable:max-line-length
    }

    private static getEnvVariableOrDefault(envVarName: string, defaultValue: any): any {
        return process.env[envVarName] || defaultValue;
    }
}

