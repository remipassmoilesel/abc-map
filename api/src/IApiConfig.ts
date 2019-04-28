export interface IApiConfig {
    httpPort: number;
    sessionSecret: string;
    mongodb: {
        port: number;
        username: number;
        password: number;
    }
}

export class ApiConfigHelper {

    public static load(): IApiConfig {
        return {
            httpPort: this.getEnvVariableOrDefault('ABC_HTTP_PORT', 32158),
            sessionSecret: this.getEnvVariableOrDefault('ABC_SESSION_SECRET', '2b3e0e5143b9c1bfcd7bde91051b16b6a07c19467a53991095226e993462a6431b36edca4fe20f01877399cb1b0d6ba4'),
            mongodb: {
                port: this.getEnvVariableOrDefault('ABC_MONGODB_PORT', 27017),
                username: this.getEnvVariableOrDefault('ABC_MONGODB_USERNAME', 'root'),
                password: this.getEnvVariableOrDefault('ABC_MONGODB_PASSWORD', 'example'),
            }
        };
    }

    private static getEnvVariableOrDefault(envVarName: string, defaultValue: any): any {
        return process.env[envVarName] || defaultValue;
    }
}

