import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatastoreService} from '../../lib/datastore/datastore.service';
import {IDocument} from 'abcmap-shared';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {forkJoin, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import * as _ from 'lodash';
import {RxUtils} from '../../lib/utils/RxUtils';
import {DocumentHelper} from '../../lib/datastore/DocumentHelper';
import {ToastService} from '../../lib/notifications/toast.service';

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

  constructor(private formBuilder: FormBuilder,
              private toast: ToastService,
              private store: Store<IMainState>,
              private datastore: DatastoreService) {
  }

  ngOnInit() {
    this.initForm();
    this.loadDocumentList();
    this.listenUploads();
  }

  ngOnDestroy(): void {
    RxUtils.unsubscribe(this.uploads$);
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      query: [''],
    });
  }

  private listenUploads(): void {
    this.uploads$ = this.store.select(state => state.gui.lastDocumentsUploaded)
      .subscribe(res => {
        this.loadDocumentList();
      });
  }

  private loadDocumentList() {
    forkJoin(
      this.datastore.listMyDocuments(),
      this.store.select(state => state.gui.lastDocumentsUploaded).pipe(take(1))
    )
      .subscribe(([documents, uploads]) => {
        this.lastUploadedDocuments = DocumentHelper.filterDocumentsByPath(documents, uploads.map(up => up.path));
        this.documents = DocumentHelper.filterCache(documents);
      });
  }

  onDeleteDocument($event: IDocument) {
    this.datastore.deleteDocument($event.path)
      .subscribe(res => {
        this.toast.info('Documents supprimés !');
        this.loadDocumentList();
      });
  }

  onAddDocumentToMap($event: IDocument) {

  }

  register() {
    if (!this.searchForm) {
      return;
    }

    // TODO
  }

  search() {
    // TODO
  }

}
