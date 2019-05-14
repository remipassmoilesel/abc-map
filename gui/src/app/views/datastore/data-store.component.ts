import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatastoreService} from '../../lib/datastore/datastore.service';
import {IDocument} from 'abcmap-shared';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {catchError, debounceTime, mergeMap} from 'rxjs/operators';
import {RxUtils} from '../../lib/utils/RxUtils';
import {DocumentHelper} from '../../lib/datastore/DocumentHelper';
import {ToastService} from '../../lib/notifications/toast.service';
import * as _ from 'lodash';

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

  public onDeleteDocument($event: IDocument) {
    this.datastore.deleteDocument($event.path)
      .subscribe(res => {
        this.toast.info('Documents supprimés !');
        this.loadDocumentList();
        this.lastUploadedDocuments = [];
      });
  }

  public onAddDocumentToMap($event: IDocument) {

  }

  public onDownloadDocument(document: IDocument) {
    this.datastore.downloadDocument(document);
  }

  private listenUploads(): void {
    this.uploads$ = this.store.select(state => state.gui.lastDocumentsUploaded)
      .pipe(
        mergeMap(uploads => {
          const docPaths = _.map(uploads, up => up.path);
          return this.datastore.fetchDocuments(docPaths);
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
}
