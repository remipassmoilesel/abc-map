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
  public postFile(fileName: string, content: ArrayBuffer): Observable<any> {
    return this.client.post(ApiRoutes.DATASTORE.path, content);
  }

}
