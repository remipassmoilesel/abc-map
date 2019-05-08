import {Component, Input, OnInit, Output} from '@angular/core';
import {IDocument} from 'abcmap-shared';

import * as filesize from 'filesize';
import {DatetimeHelper} from '../../lib/utils/DatetimeHelper';

@Component({
  selector: 'abc-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  dhelper = DatetimeHelper;
  filesize = filesize;

  @Input()
  document?: IDocument;

  constructor() { }

  ngOnInit() {
  }

}
