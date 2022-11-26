import { Shell } from './Shell';
import { Config } from '../config/Config';

export class Git {
  public static create(config: Config): Git {
    return new Git(new Shell(config));
  }

  constructor(private shell: Shell) {}

  public isRepoDirty(): boolean {
    try {
      this.shell.sync('git diff --quiet', { stdio: 'pipe' });
      return false;
    } catch (e) {
      return true;
    }
  }
}
