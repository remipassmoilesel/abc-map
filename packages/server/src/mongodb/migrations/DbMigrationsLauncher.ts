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

import { MongodbClient } from '../MongodbClient';
import { MigrationDao } from './MigrationDao';
import { MigrationScript } from './MigrationScript';
import { getScripts } from './scripts';
import { Config } from '../../config/Config';
import { Logger } from '@abc-map/shared';
import * as uuid from 'uuid-random';

export const logger = Logger.get('MigrationLauncher', 'info');

/**
 * Migration launcher
 *
 * This class launch migrations scripts then persists scripts names in a collection, in order to run them once only.
 */
export class DbMigrationsLauncher {
  public static async create(config: Config): Promise<DbMigrationsLauncher> {
    const client = await MongodbClient.createAndConnect(config);
    const dao = new MigrationDao(client);
    return new DbMigrationsLauncher(client, dao, getScripts(client));
  }

  constructor(private client: MongodbClient, private dao: MigrationDao, private scripts: MigrationScript[]) {}

  public async migrate() {
    try {
      await this.migrateInternal();
    } finally {
      await this.client.disconnect();
    }
  }

  private async migrateInternal(): Promise<void> {
    logger.info('Starting database migration');
    // DAO init
    await this.dao.init();

    // We fetch already executed scripts from database
    const executedScripts = await this.dao.findAll();
    for (const script of this.scripts) {
      // If script already executed, we skip
      const alreadyExecuted = executedScripts.find((sc) => sc.name === script.getName());
      if (alreadyExecuted) {
        logger.info(`Script ${script.getName()}: already executed.`);
        continue;
      }

      // If not, we execute it then we store its name
      logger.info(`Script ${script.getName()}: running`);
      await script.migrate();
      await this.dao.insert({ _id: uuid(), name: script.getName(), when: new Date() });
      logger.info(`Script ${script.getName()}: done`);
    }

    logger.info('End of database migration');
  }
}
