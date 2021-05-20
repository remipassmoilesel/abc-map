/*
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
 *
 *
 */

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

import { MongodbClient } from '../mongodb/MongodbClient';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { AbcProjectManifest } from '@abc-map/shared';
import { AbstractService } from '../services/AbstractService';
import { Logger } from '@abc-map/shared';

export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  UNHEALTHY = 'UNHEALTHY',
}

const logger = Logger.get('HealthCheckService.ts');

export class HealthCheckService extends AbstractService {
  public static create(client: MongodbClient): HealthCheckService {
    return new HealthCheckService(client);
  }

  constructor(private mongodbClient: MongodbClient) {
    super();
  }

  // TODO: add smtp check
  public async getHealthStatus(): Promise<HealthStatus> {
    const mongodbConnection = await this.isMongodbUp();
    if (mongodbConnection) {
      return HealthStatus.HEALTHY;
    } else {
      return HealthStatus.UNHEALTHY;
    }
  }

  private async isMongodbUp(): Promise<boolean> {
    const collection = await this.mongodbClient.collection<AbcProjectManifest>(MongodbCollection.Projects);
    return collection
      .find({})
      .limit(1)
      .maxTimeMS(5_000)
      .toArray()
      .then(() => true)
      .catch((err) => {
        logger.error('Health check error: ', err);
        return false;
      });
  }
}
