export interface Config {
  environmentName: string;
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
    username: string;
    // TODO: encrypt passwords
    password: string;
  };
}
