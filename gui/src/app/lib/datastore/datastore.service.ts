import {Injectable} from '@angular/core';
import {DatastoreClient} from './DatastoreClient';
import {forkJoin, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {mergeMap, take, tap} from 'rxjs/operators';
import {IDocument, IUploadResponse} from 'abcmap-shared';
import {GuiModule} from '../../store/gui/gui-actions';
import DocumentsUploaded = GuiModule.DocumentsUploaded;
import {ToastService} from '../notifications/toast.service';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor(private client: DatastoreClient,
              private toasts: ToastService,
              private store: Store<IMainState>) {
  }

  public listMyDocuments(): Observable<IDocument[]> {
    return this.store.select(state => state.user.username)
      .pipe(
        take(1),
        mergeMap(username => {
          return this.client.listDocuments();
        })
      );
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
    return this.client.postDocument(`upload/${name}`, content);
  }

  public downloadDocument(path: string) {
    return this.client.downloadDocument(path);
  }

  public deleteDocument(path: string): Observable<any> {
    return this.client.deleteDocument(path)
      .pipe(tap(undefined, err => this.toasts.error('Oups, il y a eu une erreur !')));
  }
}
