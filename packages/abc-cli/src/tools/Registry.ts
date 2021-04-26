import { ChildProcess } from 'child_process';
import { Shell } from './Shell';
import * as waitOn from 'wait-on';
import { Config } from '../Config';
import { Logger } from './Logger';

const logger = Logger.get('Registry');

export class RegistryProcess {
  constructor(private process: ChildProcess) {}

  public onError(handler: (e: Error) => void) {
    this.process.on('error', handler);
  }

  public terminate() {
    this.process.kill('SIGTERM');
  }
}

export class Registry {
  constructor(private config: Config, private shell: Shell) {}

  public start(logOutput = false): Promise<RegistryProcess> {
    return new Promise((resolve, reject) => {
      const startCmd = this.shell.async(`verdaccio --config ${this.config.getVerdaccioConfig()}`, {
        stdio: logOutput ? 'inherit' : 'ignore',
        cwd: this.config.getProjectRoot(),
      });
      startCmd.on('error', (err) => reject(err));
      startCmd.on('exit', (code) => {
        if (code) {
          reject(new Error(`Command failed with code ${code}: ${JSON.stringify(startCmd.spawnargs)}`));
        }
      });

      const options = {
        resources: [this.config.registryUrl()],
        timeout: 2_000,
      };
      waitOn(options)
        .then(() => resolve(new RegistryProcess(startCmd)))
        .catch(reject);
    });
  }
}
