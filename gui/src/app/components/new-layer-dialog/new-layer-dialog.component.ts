import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'abc-new-layer-dialog',
  templateUrl: './new-layer-dialog.component.html',
  styleUrls: ['./new-layer-dialog.component.scss']
})
export class NewLayerDialogComponent implements OnInit {

  @ViewChild('dialogContent')
  dialogContent!: TemplateRef<any>;

  constructor(private store: Store<IMainState>,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.listenDialogState();
  }

  listenDialogState() {
    this.store.select(state => state.gui.dialogs.selectNewLayerShowed)
      .subscribe(dialogState => {
        if (dialogState) {
          this.modalService.open(this.dialogContent);
        }
      });
  }
}
