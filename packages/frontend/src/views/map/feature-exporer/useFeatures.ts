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

    const handleUpdateFeatures = (ev: VectorSourceEvent<Geometry>) => {
      const start = Date.now();
      const features = [ev.feature, ...(ev.features ?? [])].filter((f): f is Feature => !!f);

      setFeatures((previousFeatures) => {
        // First we update existing features
        const updated: (string | number)[] = [];
        const result = previousFeatures
          .map((previousFeature) => {
            const previousId = previousFeature.getId();
            if (typeof previousId === 'undefined') {
              logger.warn('Invalid feature: ');
              return null;
            }

            const toUpdate = features.find((feature) => previousId === feature.getId());
            if (!toUpdate) {
              return previousFeature;
            }

            updated.push(previousId);
            return FeatureWrapper.from(toUpdate);
          })
          .filter((value): value is FeatureWrapper => !!value);
        logger.debug('Updated features ', updated);

        // Then we add them which was not updated
        const featuresToAdd = features.filter((feature) => !updated.find((id) => feature.getId() === id)).map((feature) => FeatureWrapper.from(feature));

        logger.debug('Add features', featuresToAdd);
        return result.concat(featuresToAdd);
      });

      logger.debug(`Update took ${Date.now() - start}ms`);
    };

    const handleRemoveFeatures = (ev: VectorSourceEvent<Geometry>) => {
      const start = Date.now();
      const features = [ev.feature, ...(ev.features ?? [])].filter((f): f is Feature => !!f);

      setFeatures((previousFeatures) => {
        const updated = previousFeatures
          .map((previousFeat) => {
            const toDelete = features.find((feature) => previousFeat.getId() === feature.getId());
            if (!toDelete) {
              return previousFeat;
            }

            return undefined;
          })
          .filter((feature): feature is FeatureWrapper => !!feature);

        logger.debug('Removed features: ', features);

        return updated;
      });

      logger.debug(`Remove took ${Date.now() - start}ms`);
    };

    source.on('addfeature', handleUpdateFeatures);
    source.on('removefeature', handleRemoveFeatures);

    // We throttle because when user drag shapes there is A LOT of events
    // But we must keep a very low wait value because otherwise some changes may be discarded
    const changeFeatureListener = throttle(handleUpdateFeatures, 500);
    source.on('changefeature', changeFeatureListener);

    return () => {
      source.un('addfeature', handleUpdateFeatures);
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
