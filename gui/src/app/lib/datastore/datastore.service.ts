import {Injectable} from '@angular/core';
import {DatastoreClient} from './DatastoreClient';
import {forkJoin, Observable, Observer} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {map, mergeMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor(private client: DatastoreClient,
              private store: Store<IMainState>) {
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
    return Observable.create((observer: Observer<any>) => {

      this.store.select(state => state.user.username)
        .pipe(
          take(1),
        )
        .subscribe((username) => {
          const content: FormData = new FormData();
          content.append('file-content', file);

          this.client.postDocument(username, `/upload/${name}`, content)
            .subscribe(
              () => observer.complete(),
              (error: Error) => observer.error(error),
            );
        });
    });
  }

  private readDocument(file: File): Observable<Buffer> {
    return Observable.create((observer: Observer<any>) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        if (!fileReader.result) {
          return observer.error(new Error('File is empty'));
        }
        observer.next(fileReader.result as ArrayBuffer);
        observer.complete();
      };

      fileReader.onerror = (error) => {
        observer.error(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  }

}
