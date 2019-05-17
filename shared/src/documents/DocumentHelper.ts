import * as _ from 'lodash';
import {IDatabaseDocument} from './IDatabaseDocument';
import {ApiRoutes} from '../routes';

export class DocumentHelper {

  private static GEOJSON_CACHE_EXT = '.cache.geojson';

  public static filterCache(documents: IDatabaseDocument[]): IDatabaseDocument[] {
    return documents.filter(item => !item.path.endsWith(this.GEOJSON_CACHE_EXT));
  }

  public static filterDocumentsByPath(documents: IDatabaseDocument[], paths: string[]): IDatabaseDocument[] {
    return _.filter(documents, doc => !!_.find(paths, name => name === doc.path));
  }

  public static downloadLink(document: IDatabaseDocument): string {
    return ApiRoutes.DOCUMENTS_DOWNLOAD_PATH.withArgs({path: btoa(document.path)}).toString();
  }

  public static geojsonCachePath(originalPath: string): string {
    return originalPath + this.GEOJSON_CACHE_EXT;
  }

}
