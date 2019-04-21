import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {GuiModule} from '../../store/gui/gui-actions';
import SelectNewLayerDialogChanged = GuiModule.SelectNewLayerDialogChanged;

@Component({
  selector: 'abc-new-layer-dialog',
  templateUrl: './new-layer-dialog.component.html',
  styleUrls: ['./new-layer-dialog.component.scss']
})
export class NewLayerDialogComponent implements OnInit {

  @ViewChild('dialogContent')
  dialogContent!: TemplateRef<any>;

  currentModalRef?: NgbModalRef;

  constructor(private store: Store<IMainState>,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.listenDialogState();
  }

  listenDialogState() {
    this.store.select(state => state.gui.dialogs.selectNewLayer)
      .subscribe(dialogState => {
        if (dialogState) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });
  }

  openModal() {
    this.currentModalRef = this.modalService.open(this.dialogContent);
  }

  closeModal() {
    if (this.currentModalRef) {
      this.currentModalRef.close();
    }
  }

  onUserConfirmation($event: MouseEvent) {
    console.log($event)
  }

  onUserCancel($event: MouseEvent) {
    this.store.dispatch(new SelectNewLayerDialogChanged({state: false}));
  }

}
