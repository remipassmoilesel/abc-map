import {Component, Input, OnInit, Output} from '@angular/core';
import {IDocument} from 'abcmap-shared';

import * as filesize from 'filesize';
import {DatetimeHelper} from '../../lib/utils/DatetimeHelper';

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

  constructor() { }

  ngOnInit() {
  }

}
