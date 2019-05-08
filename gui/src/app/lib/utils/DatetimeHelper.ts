import * as moment from 'moment';

export class DatetimeHelper {

  public static documentDateToText(date: string): string {
    return moment(date).format('DD/MM/YYYY [à] HH:mm');
  }

}
