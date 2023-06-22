import { useEffect, useState } from 'react';
import { LayerDataSource } from '../../../core/data/data-source/LayerDataSource';
import { VectorSourceEvent } from 'ol/source/Vector';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { DataRow } from '../../../core/data/data-source/DataSource';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('useDataRows.ts');

export interface Result {
  rows: DataRow[];
  disableCsv: boolean;
}

export function useDataRows(layer: LayerWrapper | undefined): Result {
  const [rows, setRows] = useState<DataRow[]>([]);
  const [disableCsv, setDisableCsv] = useState(false);

  // Each time layer id change we show data
  useEffect(() => {
    if (!layer || !layer.isVector()) {
      setRows([]);
      setDisableCsv(true);
      return;
    }

    new LayerDataSource(layer)
      .getRows()
      .then((data) => {
        setRows(data);
        setDisableCsv(data.length < 1);
      })
      .catch((err) => {
        setRows([]);
        setDisableCsv(true);
        logger.error('Data display error:', err);
      });

    const lastDeletedIndex: { [k: string]: number | undefined } = {};

    const addRows = (ev: VectorSourceEvent) => {
      const added = FeatureWrapper.fromUnknown(ev.feature)?.toDataRow();
      if (!added) {
        logger.error('Cannot add feature: ', ev.feature);
        return;
      }

      // Feature was just deleted, we reinsert it at previous position
      const index = lastDeletedIndex[added.id];
      if (typeof index !== 'undefined') {
        setRows((rows) => {
          const updated = rows.slice();
          updated.splice(index, 0, added);
          return updated;
        });
      }
      // Feature was not deleted recently
      else {
        setRows((rows) => rows.concat(added));
      }
    };

    const updateRows = (ev: VectorSourceEvent) => {
      setRows((data) => {
        const updated = FeatureWrapper.fromUnknown(ev.feature)?.toDataRow();
        if (!updated) {
          logger.error('Cannot update feature: ', ev.feature);
          return data;
        }

        return data.map((row) => (row.id === updated.id ? updated : row));
      });
    };

    const deleteRows = (ev: VectorSourceEvent) => {
      setRows((data) => {
        const deletedId = FeatureWrapper.fromUnknown(ev.feature)?.getId();
        if (typeof deletedId === 'undefined') {
          logger.error('Cannot remove feature: no id found', ev.feature);
          return data;
        }

        // We delete rows and try to keep index used in case of cancel
        const update: DataRow[] = [];
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          if (row.id === deletedId) {
            lastDeletedIndex[deletedId] = i;
          } else {
            update.push(row);
          }
        }

        return update;
      });
    };

    const vectorSource = layer.getSource();
    vectorSource.on('addfeature', addRows);
    vectorSource.on('changefeature', updateRows);
    vectorSource.on('removefeature', deleteRows);

    return () => {
      vectorSource.un('addfeature', addRows);
      vectorSource.un('changefeature', updateRows);
      vectorSource.un('removefeature', deleteRows);
    };
  }, [layer]);

  return { rows, disableCsv };
}
