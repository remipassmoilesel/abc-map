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

import { Config } from '../config/Config';
import { UserDao } from './UserDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { AbcUser, AnonymousUser } from '@abc-map/shared';
import { UserMapper } from './UserMapper';
import { PasswordHasher } from '../authentication/PasswordHasher';
import { AbstractService } from '../services/AbstractService';

export class UserService extends AbstractService {
  public static create(config: Config, client: MongodbClient): UserService {
    const hasher = new PasswordHasher(config);
    return new UserService(config, new UserDao(config, client), hasher);
  }

  constructor(private config: Config, private dao: UserDao, private hasher: PasswordHasher) {
    super();
  }

  public async init(): Promise<void> {
    return this.dao.init();
  }

  /**
   * Warning: passwords must be encrypted BEFORE saving
   * @param user
   */
  public async save(user: AbcUser): Promise<void> {
    if (!user.id) {
      return Promise.reject(new Error('Id is mandatory'));
    }
    if (user.email === AnonymousUser.email) {
      return Promise.reject(new Error(`${AnonymousUser.email} email is reserved`));
    }

    const doc = UserMapper.dtoToDoc(user);
    return this.dao.save(doc);
  }

  public async findById(userId: string): Promise<AbcUser | undefined> {
    return this.dao.findById(userId).then((res) => {
      if (res) {
        return UserMapper.docToDto(res);
      }
    });
  }

  public async findByEmail(email: string): Promise<AbcUser | undefined> {
    return this.dao.findByEmail(email).then((res) => {
      if (res) {
        return UserMapper.docToDto(res);
      }
    });
  }

  public async count(): Promise<number> {
    return this.dao.count();
  }

  public async deleteById(userId: string) {
    await this.dao.deleteById(userId);
  }
}
