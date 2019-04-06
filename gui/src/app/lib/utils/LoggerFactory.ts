import * as loglevel from 'loglevel';

loglevel.setDefaultLevel('info');

export class LoggerFactory {

  public static new(title: string): loglevel.Logger {
    return loglevel.getLogger(title);
  }

}
