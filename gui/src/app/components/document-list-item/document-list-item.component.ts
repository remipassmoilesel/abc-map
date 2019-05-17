import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDocument} from 'abcmap-shared';

import * as filesize from 'filesize';
import {DatetimeHelper} from '../../lib/utils/DatetimeHelper';
import {DocumentHelper} from '../../lib/datastore/DocumentHelper';

@Component({
  selector: 'abc-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss']
})
export class DocumentListItemComponent implements OnInit {

  dhelper = DatetimeHelper;
  filesize = filesize;

  @Input()
  document?: IDocument;

  @Output()
  addToMap = new EventEmitter<IDocument>();

  @Output()
  delete = new EventEmitter<IDocument>();

  @Output()
  download = new EventEmitter<IDocument>();

  constructor() {
  }

  ngOnInit() {
  }

  onAddToMapClick($event: MouseEvent) {
    this.addToMap.emit(this.document);
  }

  onDeleteClick($event: MouseEvent) {
    this.delete.emit(this.document);
  }

  onDownloadClick($event: MouseEvent) {
    this.download.emit(this.document);
  }
}
