import {Injectable} from '@angular/core';
import {IndividualConfig, ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private readonly toastOptions: Partial<IndividualConfig> = {
    positionClass: 'toast-bottom-right'
  };

  constructor(private toastr: ToastrService) {
  }

  info(message: string) {
    this.toastr.info(message, undefined, this.toastOptions);
  }

  error(message: string) {
    this.toastr.error(message, undefined, this.toastOptions);
  }

  errorForNonExistingProject() {
    this.error('Vous devez d\'abord créer ou ouvrir un projet');
  }

  genericError() {
    this.error('Oups, il y a eu une erreur !');
  }
}
