import {IDocument} from 'abcmap-shared';
import * as _ from 'lodash';

export class DocumentHelper {

  public static filterCache(documents: IDocument[]): IDocument[] {
    return documents.filter(item => !item.path.endsWith('.cache'));
  }

  public static filterDocumentsByPath(documents: IDocument[], paths: string[]): IDocument[] {
    return _.filter(documents, doc => !!_.find(paths, name => name === doc.path));
  }

}
