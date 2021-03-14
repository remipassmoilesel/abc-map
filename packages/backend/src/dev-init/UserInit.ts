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

  public async init(): Promise<AbcUser[]> {
    const users: AbcUser[] = [];

    // We register users
    for (const request of devUsers) {
      let user = await this.services.user.findByEmail(request.email);
      if (user) {
        users.push(user);
        continue;
      }

      await this.services.authentication.register(request, false);
      user = (await this.services.user.findByEmail(request.email)) as AbcUser;
      users.push(user);
    }

    // We enable only half of them
    for (let i = 0; i < devUsers.length / 2; i++) {
      const user = users[i];
      user.enabled = true;
      await this.services.user.save(user);
    }

    return users;
  }
}
