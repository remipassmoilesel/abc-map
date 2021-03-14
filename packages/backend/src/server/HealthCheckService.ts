import { MongodbClient } from '../mongodb/MongodbClient';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { AbcProject } from '@abc-map/shared-entities';
import { AbstractService } from '../services/AbstractService';
import { Logger } from '../utils/Logger';

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
    const collection = await this.mongodbClient.collection<AbcProject>(MongodbCollection.Projects);
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
