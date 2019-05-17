import {Injectable} from '@angular/core';
import {DatastoreClient} from './DatastoreClient';
import {Observable, Observer, throwError} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {mergeMap, take, tap} from 'rxjs/operators';
import {DocumentConstants, IDatabaseDocument, IUploadResponse} from 'abcmap-shared';
import {GuiModule} from '../../store/gui/gui-actions';
import {ToastService} from '../notifications/toast.service';
import * as _ from 'lodash';
import {HttpHeaderResponse, HttpResponse} from '@angular/common/http';
import DocumentsUploaded = GuiModule.DocumentsUploaded;

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor(private client: DatastoreClient,
              private toasts: ToastService,
              private store: Store<IMainState>) {
  }

  public listDocuments(): Observable<IDatabaseDocument[]> {
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

  public uploadDocuments(files: FileList): Observable<IUploadResponse> {
    const error = this.checkUploadRequest(files);
    if (error) {
      return error;
    }

    const content: FormData = new FormData();
    _.forEach(files, file => content.append('file', file, file.name));

    return Observable
      .create((observer: Observer<IUploadResponse>) => {
        this.client.uploadDocuments(content).subscribe(event => {
          // TODO: emit events for upload progress
          if (event instanceof HttpResponse) {
            observer.next(event.body);
            observer.complete();
          } else if (event instanceof HttpHeaderResponse && event.status !== 200) {
            observer.error(new Error(`${event.status} ${event.statusText}`));
          }
        });
      })
      .pipe(tap((res: IUploadResponse) => this.store.dispatch(new DocumentsUploaded({documents: res}))));
  }

  public downloadDocument(document: IDatabaseDocument) {
    return this.client.downloadDocument(document);
  }

  public deleteDocument(path: string): Observable<any> {
    return this.client.deleteDocument(path)
      .pipe(tap(undefined, err => this.toasts.httpError(err)));
  }

  public fetchDocuments(paths: string[]): Observable<IDatabaseDocument[]> {
    return this.client.fetchDocuments(paths)
      .pipe(tap(undefined, err => this.toasts.genericError()));
  }

  private checkUploadRequest(files: FileList): Observable<IUploadResponse> | undefined {
    if (files.length > DocumentConstants.MAX_FILES_PER_UPLOAD) {
      return throwError(new Error(`Vous ne pouvez pas téléverser plus de ${DocumentConstants.MAX_FILES_PER_UPLOAD} documents à la fois`));
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
