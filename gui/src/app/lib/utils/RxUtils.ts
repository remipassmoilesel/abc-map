import {Subscription} from 'rxjs';

export class RxUtils {

  public static unsubscribe(sub$?: Subscription) {
    if (sub$) {
      sub$.unsubscribe();
    }
  }

}
