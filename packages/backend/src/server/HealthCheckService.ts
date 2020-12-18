import { MongodbClient } from '../mongodb/MongodbClient';
import { MongoCollection } from '../mongodb/MongoCollection';
import { AbcProject } from '@abc-map/shared-entities';
import { AbstractService } from '../services/AbstractService';

export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  UNHEALTHY = 'UNHEALTHY',
}

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
    const collection = await this.mongodbClient.collection<AbcProject>(MongoCollection.Projects);
    return collection
      .find({})
      .limit(1)
      .maxTimeMS(5_000)
      .toArray()
      .then(() => true)
      .catch(() => false);
  }
}
