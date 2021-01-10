import { toast } from 'react-toastify';
import { ToastOptions } from 'react-toastify/dist/types';

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5_000,
  pauseOnFocusLoss: true,
  hideProgressBar: true,
};

export class Toasts {
  public info(message: string): void {
    const options = { ...defaultOptions };
    options.toastId = message;
    toast.info(message, options);
  }

  public error(message: string): void {
    const options = { ...defaultOptions };
    options.toastId = message;
    toast.error(message, options);
  }

  public genericError(): void {
    this.error('Une erreur est survenue, veuillez réessayer plus tard.');
  }

  public featureNotReady(): void {
    this.info("Cette fonctionnalité n'est pas encore disponible");
  }
}
