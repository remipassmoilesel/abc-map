import { Services } from '../services/services';
import { AbcUser, RegistrationRequest } from '@abc-map/shared-entities';

const devPassword = 'azerty1234';
const devUsers: RegistrationRequest[] = [
  { email: 'user1@abcmap', password: devPassword },
  { email: 'user2@abcmap', password: devPassword },
  { email: 'user3@abcmap', password: devPassword },
  { email: 'user4@abcmap', password: devPassword },
];

export class UserInit {
  public static create(services: Services) {
    return new UserInit(services);
  }

  constructor(private services: Services) {}

  public async init(): Promise<void> {
    if (await this.alreadyDone(devUsers[0].email)) {
      return;
    }

    // We register dev users
    for (const request of devUsers) {
      await this.services.authentication.register(request, false);
    }

    // We enable only half of them
    for (let i = 0; i < devUsers.length / 2; i++) {
      const user = (await this.services.user.findByEmail(devUsers[i].email)) as AbcUser;
      user.enabled = true;
      await this.services.user.save(user);
    }
  }

  private async alreadyDone(witnessEmail: string): Promise<boolean> {
    const user = await this.services.user.findByEmail(witnessEmail);
    return !!user;
  }
}
