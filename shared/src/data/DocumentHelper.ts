import * as _ from 'lodash';
import {IDocument} from './IDocument';
import {ApiRoutes} from '../routes';

export class DocumentHelper {

  private static GEOJSON_CACHE_EXT = '.cache.geojson';

  public static filterCache(documents: IDocument[]): IDocument[] {
    return documents.filter(item => !item.path.endsWith(this.GEOJSON_CACHE_EXT));
  }

  public static filterDocumentsByPath(documents: IDocument[], paths: string[]): IDocument[] {
    return _.filter(documents, doc => !!_.find(paths, name => name === doc.path));
  }

  public static downloadLink(document: IDocument): string {
    return ApiRoutes.DOCUMENTS_DOWNLOAD_PATH.withArgs({path: btoa(document.path)}).toString();
  }

}
