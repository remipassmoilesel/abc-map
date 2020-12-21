import { Services } from '../services/services';
import { UserInit } from './UserInit';
import { ProjectInit } from './ProjectInit';
import { Config, LOCAL_ENVIRONMENT } from '../config/Config';

export class DevInit {
  public static create(config: Config, services: Services) {
    return new DevInit(config, services);
  }

  constructor(private config: Config, private services: Services) {}

  public async init(): Promise<void> {
    // TODO: test
    if (this.config.environmentName !== LOCAL_ENVIRONMENT) {
      return Promise.reject(new Error("WARNING: do not enable 'development' configuration on an environment other than 'local'"));
    }

    const user = UserInit.create(this.services);
    await user.init();

    const project = ProjectInit.create(this.services);
    await project.init();
  }
}
