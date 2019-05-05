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

  // TODO: set correct url
  public postDocument(username: string, fileName: string, content: ArrayBuffer): Observable<any> {
    const url = ApiRoutes.DATASTORE.withArgs({username, name: fileName}).toString();
    return this.client.post(url, content);
  }

}
