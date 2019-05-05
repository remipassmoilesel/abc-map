import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiRoutes} from 'abcmap-shared';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatastoreClient {

  constructor(private client: HttpClient) {

  }

  public postDocument(username: string, path: string, content: FormData): Observable<any> {
    const encodedPath = btoa(path);
    const url = ApiRoutes.DATASTORE.withArgs({username, path: encodedPath}).toString();
    return this.client.post(url, content);
  }

}
