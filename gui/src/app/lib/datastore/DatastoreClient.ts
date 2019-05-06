import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiRoutes, IDocument} from 'abcmap-shared';
import {Observable, Observer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatastoreClient {

  constructor(private client: HttpClient) {

  }

  public postDocument(username: string, path: string, content: FormData): Observable<any> {
    const encodedPath = btoa(path);
    const url = ApiRoutes.DATASTORE_CREATE.withArgs({username, path: encodedPath}).toString();
    return this.client.post(url, content);
  }

  public listDocuments(username: string): Observable<IDocument[]> {
    const url = ApiRoutes.DATASTORE.withArgs({username}).toString();
    return this.client.get<IDocument[]>(url);
  }

}
