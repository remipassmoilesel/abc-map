import {Injectable} from '@angular/core';
import {DatastoreClient} from './DatastoreClient';
import {forkJoin, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {mergeMap, take, tap} from 'rxjs/operators';
import {IDocument, IUploadResponse} from 'abcmap-shared';
import {GuiModule} from '../../store/gui/gui-actions';
import {ToastService} from '../notifications/toast.service';
import DocumentsUploaded = GuiModule.DocumentsUploaded;

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
}
