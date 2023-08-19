/**
 * Copyright © 2023 Rémi Pace.
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

import { useCallback, useState } from 'react';
import { ImportResult } from './ImportResult';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import { CsvParser } from '../../../core/data/csv-parser/CsvParser';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { useServices } from '../../../core/useServices';
import { Logger } from '@abc-map/shared';
import { CsvRow } from '../../../core/data/csv-parser/typings';
import { asNumberOrString } from '../../../core/utils/numbers';
import { DataRow } from '../../../core/data/data-source/DataSource';

const logger = Logger.get('useCsv.ts');

interface Result {
  importFile: () => void;
  exportFile: () => void;
  // Last stats about import
  result: ImportResult | undefined;
}

// FIXME: Warning: do not allow users to delete lines, cancel is not implemented possible.
// FIXME: Otherwise if you import the wrong CSV file, all data will be deleted.
// FIXME: We should register history changesets then allow deletion of rows.
export function useCsv(layer: LayerWrapper | undefined, rows: DataRow[]): Result {
  const { toasts } = useServices();
  const [result, setResult] = useState<ImportResult | undefined>();

  const importFile = useCallback(() => {
    if (!layer?.isVector() || !layer?.getSource().getFeatures().length) {
      logger.error('Not ready');
      return;
    }
    setResult(undefined);

    const source = layer.getSource();
    const features = source.getFeatures();

    const result: ImportResult = {
      file: undefined,
      imported: 0,
      skipped: 0,
      skippedIds: [],
      error: null,
    };

    const doImport = async () => {
      const response = await FileIO.openPrompt(InputType.Single, '.csv');
      if (response.type !== InputResultType.Confirmed) {
        return;
      }

      const file = response.files[0];
      result.file = file;

      const parsed = await CsvParser.parse(file);

      if (!parsed.length) {
        result.error = new Error('Invalid CSV file, nothing was parsed');
        setResult(result);
        return;
      }

      // Then we update features
      for (const line of parsed) {
        const featureId = csvLineId(line);
        const feature = features.find((f) => f.getId() === featureId);
        if (!feature) {
          result.skipped++;
          result.skippedIds.push(featureId ?? '<undefined id>');
          continue;
        }

        const properties = deleteCsvLineId(line);
        FeatureWrapper.from(feature).setDataProperties(properties);
        result.imported++;
      }

      setResult(result);
    };

    doImport().catch((error) => {
      logger.error('Upload error: ', error);
      setResult({ ...result, error });
    });
  }, [layer]);

  const exportFile = useCallback(() => {
    if (!layer) {
      logger.error('Not ready');
      return;
    }

    const fileName = `${layer.getName()}.csv`;
    const csvRows: CsvRow[] = rows.map((r) => {
      const result: CsvRow = {};
      setCsvLineId(result, r.id);
      for (const key in r.data) {
        const value = r.data[key];
        result[key] = asNumberOrString(value);
      }
      return result;
    });

    CsvParser.unparse(csvRows, fileName)
      .then((file) => FileIO.downloadBlob(file, fileName))
      .catch((err) => {
        logger.error('CSV error:', err);
        toasts.genericError();
      });
  }, [layer, rows, toasts]);

  return {
    result,
    importFile,
    exportFile,
  };
}

export const CsvLineIdFieldName = '__id__';

function csvLineId(line: CsvRow): string | undefined {
  return line[CsvLineIdFieldName] as string | undefined;
}

function deleteCsvLineId(line: CsvRow): CsvRow {
  const copy = { ...line };
  delete copy[CsvLineIdFieldName];
  return copy;
}

function setCsvLineId(line: CsvRow, id: string | number): void {
  line[CsvLineIdFieldName] = id;
}
