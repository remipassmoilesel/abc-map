/**
 * Copyright © 2022 Rémi Pace.
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

import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { useEffect, useState } from 'react';
import { VectorSourceEvent } from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import throttle from 'lodash/throttle';
import { getAllFieldNames, getFieldNames, trySelectMainFieldName } from '../../../core/data/getFieldNames';
import { Logger } from '@abc-map/shared';
import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { DataRow } from '../../../core/data/data-source/DataSource';
import uniq from 'lodash/uniq';
import BaseEvent from 'ol/events/Event';

const logger = Logger.get('useFeatures.ts');

export function disableUseFeatureLogging() {
  logger.disable();
}

interface Result {
  loading: boolean;
  features: FeatureWrapper[];
  fieldNames: string[];
  nameField: string | undefined;
}

export function useFeatures(vectorLayer: VectorLayerWrapper | undefined): Result {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<FeatureWrapper[]>([]);
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [mainFieldName, setMainFieldName] = useState<string | undefined>();

  // Each time features are added to / removed from source, we update display
  useEffect(() => {
    const source = vectorLayer?.getSource();
    if (!source) {
      return;
    }

    const lastDeletedIndex: { [k: string | number]: number | undefined } = {};

    const handleAddFeature = (ev: VectorSourceEvent<Geometry>) => {
      const start = Date.now();
      const added = FeatureWrapper.fromUnknown(ev.feature);
      const featureId = added?.getId();
      if (!added || !featureId) {
        logger.error('Cannot add feature: ', ev.feature);
        return;
      }

      // Feature was just deleted, we reinsert it at previous position
      const index = lastDeletedIndex[featureId];
      if (typeof index !== 'undefined') {
        setFeatures((features) => {
          const updated = features.slice();
          updated.splice(index, 0, added);
          return updated;
        });
      }
      // Feature was not deleted recently
      else {
        setFeatures((features) => features.concat(added));
      }

      logger.debug(`Update took ${Date.now() - start}ms`);
    };

    const handleUpdateFeature = (ev: VectorSourceEvent<Geometry>) => {
      const updated = FeatureWrapper.fromUnknown(ev.feature);
      const featureId = updated?.getId();
      if (!updated || !featureId) {
        logger.error('Cannot update feature: ', ev.feature);
        return;
      }

      setFeatures((previousFeatures) => {
        return previousFeatures.map((feature) => (feature.getId() === updated.getId() ? updated : feature));
      });
    };

    const handleRemoveFeatures = (ev: VectorSourceEvent<Geometry>) => {
      const start = Date.now();
      const toDelete = [ev.feature, ...(ev.features ?? [])].filter((f): f is Feature => !!f);

      setFeatures((previousFeatures) => {
        // We delete rows and try to keep index used in case of cancel
        const update: FeatureWrapper[] = [];
        for (let i = 0; i < previousFeatures.length; i++) {
          const feat = previousFeatures[i];
          const featId = feat.getId();
          if (featId && toDelete.find((f) => f.getId() === featId)) {
            lastDeletedIndex[featId] = i;
          } else {
            update.push(feat);
          }
        }

        return update;
      });

      logger.debug(`Remove took ${Date.now() - start}ms`);
    };

    source.on('addfeature', handleAddFeature);
    source.on('removefeature', handleRemoveFeatures);

    // We throttle because when user drag shapes there is A LOT of events
    // But we must keep a very low wait value because otherwise some changes may be discarded
    const changeFeatureListener = throttle(handleUpdateFeature, 500);
    source.on('changefeature', changeFeatureListener);

    return () => {
      source.un('addfeature', handleAddFeature);
      source.un('removefeature', handleRemoveFeatures);
      source.un('changefeature', changeFeatureListener);
    };
  }, [vectorLayer]);

  // Each time layer change we list features
  useEffect(() => {
    setFeatures([]);
    setFieldNames([]);

    if (!vectorLayer) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const olFeatures = vectorLayer.getSource().getFeatures();

    const rows: DataRow[] = [];
    const features: FeatureWrapper[] = [];

    // Eeach time feature properties change, we update display
    const handlePropertiesChange = (ev: BaseEvent) => {
      const feature = FeatureWrapper.fromUnknown(ev.target);
      if (!feature) {
        return;
      }

      const row = feature.toDataRow();
      if (!row) {
        return;
      }

      const newFieldNames = getFieldNames(row);
      setFieldNames((previous) => uniq(previous.concat(newFieldNames)));
    };

    for (const feat of olFeatures) {
      const feature = FeatureWrapper.from(feat);
      features.push(feature);

      // Each time properties change we update field names
      feature.unwrap().on('propertychange', handlePropertiesChange);

      const row = feature.toDataRow();
      rows.push(row);
    }

    const fieldNames = getAllFieldNames(rows);

    setFeatures(features);
    setFieldNames(fieldNames);
    setMainFieldName(trySelectMainFieldName(fieldNames));
    setLoading(false);

    return () => {
      features.forEach((feature) => {
        feature.unwrap().un('propertychange', handlePropertiesChange);
      });
    };
  }, [vectorLayer]);

  return {
    loading,
    features,
    fieldNames,
    nameField: mainFieldName,
  };
}
