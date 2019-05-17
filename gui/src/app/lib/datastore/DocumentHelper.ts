import {ApiRoutes, IDatabaseDocument} from 'abcmap-shared';
import * as _ from 'lodash';

export class DocumentHelper {

  public static filterCache(documents: IDatabaseDocument[]): IDatabaseDocument[] {
    return documents.filter(item => !item.path.endsWith('.cache'));
  }

  public static filterDocumentsByPath(documents: IDatabaseDocument[], paths: string[]): IDatabaseDocument[] {
    return _.filter(documents, doc => !!_.find(paths, name => name === doc.path));
  }

  public static downloadLink(document: IDatabaseDocument): string {
    return ApiRoutes.DOCUMENTS_PATH.withArgs({path: btoa(document.path)}).toString();
  }
}
