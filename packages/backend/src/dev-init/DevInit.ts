import { Services } from '../services/services';
import { UserInit } from './UserInit';
import { ProjectInit } from './ProjectInit';
import { Config, LOCAL_ENVIRONMENT, TEST_ENVIRONMENT } from '../config/Config';

export class DevInit {
  public static create(config: Config, services: Services) {
    return new DevInit(config, services);
  }

  constructor(private config: Config, private services: Services) {}

  // TODO: test
  public async init(): Promise<void> {
    const authorizedEnvs = [LOCAL_ENVIRONMENT, TEST_ENVIRONMENT];
    if (authorizedEnvs.indexOf(this.config.environmentName) === -1) {
      return Promise.reject(new Error("WARNING: do not enable 'development' configuration on an environment other than 'local' or 'test'"));
    }

    const user = UserInit.create(this.services);
    const users = await user.init();

    const project = ProjectInit.create(this.services);
    await project.init(users);
  }
}
