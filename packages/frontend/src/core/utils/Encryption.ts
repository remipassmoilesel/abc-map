import * as sjcl from 'sjcl';
import { AbcLayer, AbcProject, AbcWmsLayer, LayerType, WmsMetadata } from '@abc-map/shared-entities';

/**
 * Warning: changes in this file will require a data migration
 */
export class Encryption {
  private static readonly PREFIX = 'encrypted:';

  public static async encrypt(text: string, secret: string): Promise<string> {
    return this.PREFIX + btoa(JSON.stringify(sjcl.encrypt(secret + secret, text).toString()));
  }

  public static async decrypt(text: string, secret: string): Promise<string> {
    const encrypted = JSON.parse(atob(text.substr(this.PREFIX.length)));
    try {
      return sjcl.decrypt(secret + secret, encrypted).toString();
    } catch (err) {
      return Promise.reject(new Error(`Invalid password: ${err.message}`));
    }
  }

  public static async encryptWmsMetadata(metadata: WmsMetadata, password: string): Promise<WmsMetadata> {
    const result: WmsMetadata = {
      ...metadata,
    };
    if (!result.auth || !result.auth.username || !result.auth.password) {
      return Promise.reject(new Error('Cannot encrypt wms metadata, invalid credentials'));
    }

    result.remoteUrl = await Encryption.encrypt(result.remoteUrl, password);
    result.auth.username = await Encryption.encrypt(result.auth.username, password);
    result.auth.password = await Encryption.encrypt(result.auth.password, password);
    return result;
  }

  public static async decryptWmsMetadata(metadata: WmsMetadata, password: string): Promise<WmsMetadata> {
    const result: WmsMetadata = {
      ...metadata,
    };
    if (!result.auth || !result.auth.username || !result.auth.password) {
      return Promise.reject(new Error('Cannot encrypt wms metadata, invalid credentials'));
    }

    result.remoteUrl = await Encryption.decrypt(result.remoteUrl, password);
    result.auth.username = await Encryption.decrypt(result.auth.username, password);
    result.auth.password = await Encryption.decrypt(result.auth.password, password);
    return result;
  }

  public static async decryptProject(project: AbcProject, password: string): Promise<AbcProject> {
    const layers: AbcLayer[] = [];
    for (const lay of project.layers) {
      if (LayerType.Wms === lay.type && lay.metadata.auth?.username && lay.metadata.auth?.password) {
        const decrypted: AbcWmsLayer = {
          ...lay,
          metadata: await this.decryptWmsMetadata(lay.metadata, password),
        };
        layers.push(decrypted);
      } else {
        layers.push(lay);
      }
    }

    return {
      ...project,
      layers,
    };
  }
}
