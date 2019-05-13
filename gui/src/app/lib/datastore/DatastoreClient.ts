import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiRoutes, IDocument, IUploadResponse} from 'abcmap-shared';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatastoreClient {

  constructor(private client: HttpClient) {

  }

  public postDocument(path: string, content: FormData): Observable<any> {
    const url = ApiRoutes.DOCUMENTS_PATH.withArgs({path: this.encodeDocumentName(path)}).toString();
    return this.client.post<IUploadResponse>(url, content);
  }

  public listDocuments(): Observable<IDocument[]> {
    const url = ApiRoutes.DOCUMENTS.toString();
    return this.client.get<IDocument[]>(url);
  }

  public downloadDocument(path: string) {
    const url = ApiRoutes.DOCUMENTS_PATH.withArgs({path: this.encodeDocumentName(path)}).toString();
    return this.client.get<any>(url);
  }

  private encodeDocumentName(path: string): string {
    return btoa(path);
  }
}
