/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { Services } from '../services/services';
import { AbcUser, RegistrationRequest } from '@abc-map/shared-entities';

const devPassword = 'azerty1234';

const numberOfUsers = 500;
const enabledUsers = 450;

function devUserEmail(id: number): string {
  return 'user-' + id + '@abc-map.fr';
}

export class UserInit {
  public static create(services: Services) {
    return new UserInit(services);
  }

  constructor(private services: Services) {}

  public async init(): Promise<AbcUser[]> {
    const users: AbcUser[] = [];

    for (let i = 0; i < numberOfUsers; i++) {
      const request: RegistrationRequest = {
        email: devUserEmail(i),
        password: devPassword,
      };

      // If user is already registered we do nothing
      let user = await this.services.user.findByEmail(request.email);
      if (user) {
        users.push(user);
        continue;
      }

      // We create user
      await this.services.authentication.register(request, false);
      user = (await this.services.user.findByEmail(request.email)) as AbcUser;

      // We enable user
      if (i < enabledUsers) {
        user.enabled = true;
        await this.services.user.save(user);
      }

      users.push(user);
    }

    return users;
  }
}
