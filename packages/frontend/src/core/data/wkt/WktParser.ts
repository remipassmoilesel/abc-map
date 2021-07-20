import { Prj, PrjWkt } from './Prj';
import { BlobIO, Logger } from '@abc-map/shared';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const wktParser = require('wkt-parser').default ? require('wkt-parser').default : require('wkt-parser');

const logger = Logger.get('WktParser.ts');

export class WktParser {
  /**
   * Par a PRJ file if possible. If something fail, return undefined.
   *
   * We choose to not fail here in order to try shapefile import anyway in case of failure.
   * @param blob
   */
  public static async parsePrj(blob: Blob): Promise<Prj | undefined> {
    const content = await BlobIO.asString(blob).catch((err: Error) => err);
    if (typeof content !== 'string') {
      logger.debug('Bad blob content: ', { content });
      return undefined;
    }

    let wkt: PrjWkt;
    try {
      wkt = wktParser(content);
    } catch (error) {
      logger.debug('WKT Parsing error: ', { error });
      return;
    }

    if (wkt.type !== 'PROJCS' || !wkt.name || !wkt.projName || !wkt.srsCode) {
      logger.debug('Bad WKT parsed: ', { wkt });
      return;
    }

    return { original: content, wkt };
  }
}
