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
import { Config } from '../config/Config';

const devPassword = 'azerty1234';

function devUserEmail(id: number): string {
  return 'user-' + id + '@abc-map.fr';
}

export class UserInit {
  public static create(config: Config, services: Services) {
    return new UserInit(config, services);
  }

  constructor(private config: Config, private services: Services) {}

  public async init(): Promise<AbcUser[]> {
    const users: AbcUser[] = [];

    const numberOfUsers = this.config.development?.users || 0;
    const enabledUsers = this.config.development?.enabledUsers || 0;
    if (!numberOfUsers) {
      return [];
    }

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
