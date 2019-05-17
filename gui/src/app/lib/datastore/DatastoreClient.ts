import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DocumentHelper, ApiRoutes, IDatabaseDocument, IFetchDocumentsRequest, ISearchDocumentsRequest, IUploadResponse} from 'abcmap-shared';
import {Observable} from 'rxjs';
import {} from 'abcmap-shared';
import {FeatureCollection} from 'geojson';

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

  public listDocuments(): Observable<IDatabaseDocument[]> {
    const url = ApiRoutes.DOCUMENTS.toString();
    return this.client.get<IDatabaseDocument[]>(url);
  }

  public search(query: string): Observable<IDatabaseDocument[]> {
    const url = ApiRoutes.DOCUMENTS_SEARCH.toString();
    const request: ISearchDocumentsRequest = {query};
    return this.client.post<IDatabaseDocument[]>(url, request);
  }

  public getDatabaseDocuments(documentPaths: string[]): Observable<IDatabaseDocument[]> {
    const url = ApiRoutes.DOCUMENTS.toString();
    const request: IFetchDocumentsRequest = {paths: documentPaths};
    return this.client.post<IDatabaseDocument[]>(url, request);
  }

  public getDocumentContent(path: string): Observable<FeatureCollection> {
    const url = ApiRoutes.DOCUMENTS_PATH.withArgs({path: this.encodeDocumentPath(path)}).toString();
    return this.client.get<FeatureCollection>(url);
  }

  public redirectToDownloadDocument(document: IDatabaseDocument): void {
    window.location.href = DocumentHelper.downloadLink(document);
  }

  public deleteDocument(path: string): Observable<any> {
    const url = ApiRoutes.DOCUMENTS_PATH.withArgs({path: this.encodeDocumentPath(path)}).toString();
    return this.client.delete<any>(url);
  }

  private encodeDocumentPath(path: string): string {
    return btoa(path);
  }

}
