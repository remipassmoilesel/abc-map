import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiRoutes, IDocument, IFetchDocumentsRequest, ISearchDocumentsRequest, IUploadResponse} from 'abcmap-shared';
import {Observable} from 'rxjs';
import {DocumentHelper} from './DocumentHelper';

@Injectable({
  providedIn: 'root'
})
export class DatastoreClient {

  constructor(private client: HttpClient) {

  }

  public uploadDocuments(formData: FormData): Observable<HttpEvent<any>> {
    const url = ApiRoutes.DOCUMENTS_UPLOAD.toString();
    const req = new HttpRequest('POST', url, formData, {reportProgress: true});
    return this.client.request(req);
  }

  public listDocuments(): Observable<IDocument[]> {
    const url = ApiRoutes.DOCUMENTS.toString();
    return this.client.get<IDocument[]>(url);
  }

  public search(query: string): Observable<IDocument[]> {
    const url = ApiRoutes.DOCUMENTS_SEARCH.toString();
    const request: ISearchDocumentsRequest = {query};
    return this.client.post<IDocument[]>(url, request);
  }

  public fetchDocuments(documentPaths: string[]): Observable<IDocument[]> {
    const url = ApiRoutes.DOCUMENTS.toString();
    const request: IFetchDocumentsRequest = {paths: documentPaths};
    return this.client.post<IDocument[]>(url, request);
  }

  public downloadDocument(document: IDocument) {
    window.location.href = DocumentHelper.downloadLink(document);
  }

  public deleteDocument(path: string) {
    const url = ApiRoutes.DOCUMENTS_PATH.withArgs({path: this.encodeDocumentName(path)}).toString();
    return this.client.delete<any>(url);
  }

  private encodeDocumentName(path: string): string {
    return btoa(path);
  }

}
