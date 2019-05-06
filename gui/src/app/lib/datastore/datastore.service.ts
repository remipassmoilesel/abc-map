import {Injectable} from '@angular/core';
import {DatastoreClient} from './DatastoreClient';
import {forkJoin, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {mergeMap, take} from 'rxjs/operators';
import {IDocument} from 'abcmap-shared';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor(private client: DatastoreClient,
              private store: Store<IMainState>) {
  }

  public listMyDocuments(): Observable<IDocument[]> {
    return this.store.select(state => state.user.username)
      .pipe(
        take(1),
        mergeMap(username => {
          return this.client.listDocuments(username);
        })
      );
  }

  public uploadDocuments(files: FileList): Observable<any> {

    const uploadObservables = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadObservables.push(this.uploadDocument(file.name, file));
    }

    return forkJoin(uploadObservables);
  }

  private uploadDocument(name: string, file: File): Observable<any> {
    return this.store.select(state => state.user.username)
      .pipe(
        take(1),
        mergeMap(username => {
          const content: FormData = new FormData();
          content.append('file-content', file);
          return this.client.postDocument(username, `upload/${name}`, content);
        })
      );
  }

}
