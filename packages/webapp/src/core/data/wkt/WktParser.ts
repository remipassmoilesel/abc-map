/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

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
