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
import { AbcUser } from '@abc-map/shared';
import { Config } from '../config/Config';
import * as uuid from 'uuid-random';
import { PasswordHasher } from '../authentication/PasswordHasher';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('UserInit.ts', 'info');

const devPassword = 'azerty1234';

function devUserEmail(id: number): string {
  return `user-${id}@abc-map.fr`;
}

export class UserInit {
  public static create(config: Config, services: Services) {
    const hasher = new PasswordHasher(config);
    return new UserInit(config, hasher, services);
  }

  constructor(private config: Config, private hasher: PasswordHasher, private services: Services) {}

  public async init(): Promise<void> {
    const numberOfUsers = this.config.development?.generateData?.users || 0;
    if (!numberOfUsers) {
      return;
    }

    const existing = await this.services.user.count();
    if (existing >= numberOfUsers) {
      return;
    }

    for (let i = 0; i < numberOfUsers; i++) {
      const user: AbcUser = {
        id: uuid(),
        email: devUserEmail(i),
        password: '',
      };
      user.password = await this.hasher.hashPassword(devPassword, user.id);

      await this.services.user.save(user);
    }

    logger.info(`${numberOfUsers} users created.`);
  }
}
