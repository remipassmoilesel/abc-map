import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatastoreService} from '../../lib/datastore/datastore.service';
import {DocumentHelper, IDocument} from 'abcmap-shared';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {of, Subscription} from 'rxjs';
import {catchError, debounceTime, mergeMap} from 'rxjs/operators';
import {RxUtils} from '../../lib/utils/RxUtils';
import {ToastService} from '../../lib/notifications/toast.service';
import * as _ from 'lodash';
import {olFromLonLat, OlMap, OlStroke, OlStyle, OlView} from '../../lib/OpenLayersImports';
import {OlLayerFactory} from '../../lib/map/OlLayerFactory';
import {FeatureCollection} from 'geojson';
import {DatetimeHelper} from '../../lib/utils/DatetimeHelper';
import * as filesize from 'filesize';

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
  documents: IDocument[] = [];
  lastUploadedDocuments: IDocument[] = [];
  map?: OlMap;

  dhelper = DatetimeHelper;
  filesize = filesize;

  private uploads$?: Subscription;
  private search$?: Subscription;
  private documentOnPreview?: IDocument;

  constructor(private formBuilder: FormBuilder,
              private toast: ToastService,
              private store: Store<IMainState>,
              private datastore: DatastoreService) {
  }

  ngOnInit() {
    this.initSearchForm();
    this.listenUploads();
    this.loadDocumentList(true);
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
        if (documents.length) {
          this.setCurrentPreview(this.documents[0]);
        }
      });
  }

  public onDeleteDocument($event: IDocument) {
    this.datastore.deleteDocument($event.path)
      .subscribe(res => {
        this.toast.info('Documents supprimés !');
        this.loadDocumentList(true);
        this.lastUploadedDocuments = [];
      });
  }

  public onAddDocumentToMap(document: IDocument) {
    this.datastore.addGeojsonContentToProject(document).subscribe();
  }

  public onDownloadDocument(document: IDocument) {
    this.datastore.userDownloadDocument(document);
  }

  public setCurrentPreview(document: IDocument) {
    this.documentOnPreview = document;
    
    this.datastore.getDocumentContentAsGeoJson(document)
      .subscribe(documentContent => {
        this.setupPreviewMap(document, documentContent);
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
          return this.datastore.getDocuments(docPaths);
        })
      )
      .subscribe(lastUploads => {
        this.lastUploadedDocuments = lastUploads;
        this.loadDocumentList(false);
        if (lastUploads.length) {
          this.setCurrentPreview(lastUploads[0]);
        }
      });
  }

  private loadDocumentList(updatePreview: boolean) {
    this.datastore.listDocuments()
      .subscribe(documents => {
        this.documents = DocumentHelper.filterCache(documents);
        if (updatePreview && this.documents.length) {
          this.setCurrentPreview(this.documents[0]);
        }
      });
  }

  private setupPreviewMap(document: IDocument, documentContent: FeatureCollection<any, any>) {

    const previewMapStyle = new OlStyle({
      stroke: new OlStroke({color: 'red', width: 2})
    });

    if (this.map) {
      this.map.setTarget(null as any);
    }
    this.map = new OlMap({
        target: 'abc-preview-map',
        layers: [OlLayerFactory.newOsmLayer()],
        view: new OlView({
          center: olFromLonLat([37.41, 8.82]),
          zoom: 4,
          projection: 'EPSG:3857'
        }),
      }
    );

    const previewLayer = OlLayerFactory.newVectorLayer(document.path, documentContent, previewMapStyle);
    this.map.addLayer(previewLayer);

    const extent = previewLayer.getSource().getExtent();
    this.map.getView().fit(extent);
  }

}
