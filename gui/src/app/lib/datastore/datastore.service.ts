import {Injectable} from '@angular/core';
import {DatastoreClient} from './DatastoreClient';
import {forkJoin, Observable, throwError} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {mergeMap, take, tap} from 'rxjs/operators';
import {IDocument, IUploadResponse, DocumentConstants} from 'abcmap-shared';
import {GuiModule} from '../../store/gui/gui-actions';
import {ToastService} from '../notifications/toast.service';
import DocumentsUploaded = GuiModule.DocumentsUploaded;
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor(private client: DatastoreClient,
              private toasts: ToastService,
              private store: Store<IMainState>) {
  }

  public listDocuments(): Observable<IDocument[]> {
    return this.store.select(state => state.user.username)
      .pipe(
        take(1),
        mergeMap(username => {
          return this.client.listDocuments();
        })
      );
  }

  public search(query: string) {
    return this.client.search(query)
      .pipe(tap(undefined, err => this.toasts.genericError()));
  }

  public uploadDocuments(files: FileList): Observable<IUploadResponse[]> {

    const error = this.checkUploadRequest(files);
    if (error) {
      return error;
    }

    const uploadObservables = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadObservables.push(this.uploadDocument(file.name, file));
    }

    return forkJoin(uploadObservables)
      .pipe(tap(res => this.store.dispatch(new DocumentsUploaded({documents: res}))));
  }

  private uploadDocument(name: string, file: File): Observable<IUploadResponse> {
    const content: FormData = new FormData();
    content.append('file-content', file);
    return this.client.uploadDocument(`upload/${name}`, content);
  }

  public downloadDocument(document: IDocument) {
    return this.client.downloadDocument(document);
  }

  public deleteDocument(path: string): Observable<any> {
    return this.client.deleteDocument(path)
      .pipe(tap(undefined, err => this.toasts.httpError(err)));
  }

  public fetchDocuments(paths: string[]): Observable<IDocument[]> {
    return this.client.fetchDocuments(paths)
      .pipe(tap(undefined, err => this.toasts.genericError()));
  }

  private checkUploadRequest(files: FileList): Observable<IUploadResponse[]> | undefined {
    if (files.length > DocumentConstants.MAX_NUMBER_PER_UPLOAD) {
      return throwError(new Error(`Vous ne pouvez pas téléverser plus de ${DocumentConstants.MAX_NUMBER_PER_UPLOAD} documents à la fois`));
    }

    const invalidFiles: ArrayLike<string> = _.chain(files)
      .filter(file => file.size > DocumentConstants.MAX_SIZE_PER_FILE)
      .map(file => file.name)
      .value();

    if (invalidFiles.length > 0) {
      return throwError(new Error('Les fichiers suivants sont trop volumineux: ' + _.join(invalidFiles, ', ')));
    }
  }
}
