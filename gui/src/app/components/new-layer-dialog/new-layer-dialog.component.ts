import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {GuiModule} from '../../store/gui/gui-actions';
import {ProjectModule} from '../../store/project/project-actions';
import {MapLayerType} from 'abcmap-shared';
import SelectNewLayerDialogChanged = GuiModule.SelectNewLayerDialogChanged;
import VectorLayerAdded = ProjectModule.VectorLayerAdded;
import WmsLayerAdded = ProjectModule.WmsLayerAdded;

@Component({
  selector: 'abc-new-layer-dialog',
  templateUrl: './new-layer-dialog.component.html',
  styleUrls: ['./new-layer-dialog.component.scss']
})
export class NewLayerDialogComponent implements OnInit {

  selectedLayerType = MapLayerType.Vector;
  types = MapLayerType;

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

  onUserConfirmation($event: MouseEvent) {
    switch (this.selectedLayerType) {
      case MapLayerType.Vector:
        this.store.dispatch(new VectorLayerAdded());
        break;
      case MapLayerType.Wms:
        this.store.dispatch(new WmsLayerAdded({url: '', params: {}}));
        break;
      default:
        throw new Error('Unknown: ' + this.selectedLayerType);
    }

    this.dispatchCloseModalEvent();
  }

  onUserCancel($event: MouseEvent) {
    this.dispatchCloseModalEvent();
  }

  openCatalogDialog($event: MouseEvent) {
    // TODO: open catalog dialog
    this.dispatchCloseModalEvent();
  }

  dispatchCloseModalEvent() {
    this.store.dispatch(new SelectNewLayerDialogChanged({state: false}));
  }

  openModal() {
    this.currentModalRef = this.modalService.open(this.dialogContent);
  }

  closeModal() {
    if (this.currentModalRef) {
      this.currentModalRef.close();
    }
  }

}
