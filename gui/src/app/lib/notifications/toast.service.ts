import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {}

  info(message: string) {
    this.toastr.info(message);
  }

  error(message: string) {
    this.toastr.error(message);
  }

  errorForNonExisitingProject() {
    this.error('Vous devez d\'abord créer ou ouvrir un projet');
  }
}
