import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatastoreService} from '../../lib/datastore/datastore.service';
import {DocumentHelper, IDatabaseDocument} from 'abcmap-shared';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {of, Subscription} from 'rxjs';
import {catchError, debounceTime, mergeMap} from 'rxjs/operators';
import {RxUtils} from '../../lib/utils/RxUtils';
import {ToastService} from '../../lib/notifications/toast.service';
import * as _ from 'lodash';
import {olFromLonLat, OlMap, OlView} from '../../lib/OpenLayersImports';
import {OlLayerFactory} from '../../lib/map/OlLayerFactory';

interface ISearchForm {
  query: string;
}

@Component({
  selector: 'abc-store',
  templateUrl: './data-store.component.html',
  styleUrls: ['./data-store.component.scss']
})
export class DataStoreComponent implements OnInit, OnDestroy {

  searchForm?: FormGroup;
  documents: IDatabaseDocument[] = [];
  lastUploadedDocuments: IDatabaseDocument[] = [];
  map?: OlMap;

  private uploads$?: Subscription;
  private search$?: Subscription;

  constructor(private formBuilder: FormBuilder,
              private toast: ToastService,
              private store: Store<IMainState>,
              private datastore: DatastoreService) {
  }

  ngOnInit() {
    this.initSearchForm();
    this.listenUploads();
    this.loadDocumentList();
    this.setupPreviewMap();
  }

  ngOnDestroy(): void {
    RxUtils.unsubscribe(this.uploads$);
  }

  private initSearchForm() {
    this.searchForm = this.formBuilder.group({
      query: [''],
    });

    this.search$ = this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        mergeMap((form: ISearchForm) => {
          if (form.query) {
            return this.datastore.search(form.query);
          } else {
            return this.datastore.listDocuments();
          }
        }),
        catchError(err => [])
      )
      .subscribe((documents) => {
        this.lastUploadedDocuments = [];
        this.documents = DocumentHelper.filterCache(documents);
      });
  }

  public onDeleteDocument($event: IDatabaseDocument) {
    this.datastore.deleteDocument($event.path)
      .subscribe(res => {
        this.toast.info('Documents supprimés !');
        this.loadDocumentList();
        this.lastUploadedDocuments = [];
      });
  }

  public onAddDocumentToMap(document: IDatabaseDocument) {
    this.datastore.addDocumentToProject(document).subscribe();
  }

  public onDownloadDocument(document: IDatabaseDocument) {
    this.datastore.userDownloadDocument(document);
  }

  public onPreviewDocument(document: IDatabaseDocument) {
    const cachePath = DocumentHelper.geojsonCachePath(document.path);
    this.datastore.getFullDocument(cachePath)
      .subscribe(document => {

      });
  }

  private listenUploads(): void {
    this.uploads$ = this.store.select(state => state.gui.lastUploadResponse)
      .pipe(
        mergeMap(uploads => {
          if (!uploads) {
            return of([]);
          }
          const docPaths = _.map(uploads.documents, up => up.path);
          return this.datastore.getDatabaseDocuments(docPaths);
        })
      )
      .subscribe(documents => {
        this.lastUploadedDocuments = documents;
        this.loadDocumentList();
      });
  }

  private loadDocumentList() {
    this.datastore.listDocuments()
      .subscribe(documents => this.documents = DocumentHelper.filterCache(documents));
  }

  private setupPreviewMap() {
    this.map = new OlMap({
        target: 'preview-map',
        layers: [OlLayerFactory.newOsmLayer()],
        view: new OlView({
          center: olFromLonLat([37.41, 8.82]),
          zoom: 4,
        }),
      }
    );
  }
}
