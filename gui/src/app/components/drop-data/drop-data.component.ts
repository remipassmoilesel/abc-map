import {Component, OnInit} from '@angular/core';
import {ToastService} from '../../lib/notifications/toast.service';
import {DatastoreService} from '../../lib/datastore/datastore.service';

@Component({
  selector: 'abc-drop-data',
  templateUrl: './drop-data.component.html',
  styleUrls: ['./drop-data.component.scss']
})
export class DropDataComponent implements OnInit {

  visible = false;

  constructor(private toast: ToastService,
              private datastore: DatastoreService) {
  }

  ngOnInit() {
    const dropArea: HTMLElement | null = document.querySelector('body');
    if (!dropArea) {
      throw new Error();
    }

    dropArea.ondrop = this.dropHandler;
    dropArea.ondragover = this.dropHandler;
    dropArea.ondragenter = this.dropHandler;
  }

  private dropHandler = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.visible = true;

    if (this.isDropEvent(event)) {
      const files = this.getFilesFromDropEvent(event);
      if (!files) {
        return this.toast.error('Vous devez déposer des fichiers valides');
      }

      this.datastore.uploadDocuments(files)
        .subscribe((res: any) => {
          this.toast.info('Documents téléversés !');
          this.visible = false;
        }, err => {
          this.toast.error('Erreur lors du téléversement !');
          this.visible = false;
        });
    }

  };

  private getFilesFromDropEvent(event: DragEvent): FileList | null {
    return event.dataTransfer && event.dataTransfer.files;
  }


  private isDropEvent(event: DragEvent): boolean {
    return event.type === 'drop';
  }
}
