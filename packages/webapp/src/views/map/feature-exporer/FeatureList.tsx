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

import React, { CSSProperties, useCallback, useMemo, useState } from 'react';
import { FeatureRow, featureRowClosedHeight, FeatureRowPersistentState } from './feature-row/FeatureRow';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { Logger } from '@abc-map/shared';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';

const logger = Logger.get('FeatureList.tsx');

interface Props {
  features: FeatureWrapper[];
  mainField: string | undefined;
  onHighlight: (f: FeatureWrapper) => void;
  onZoomOn: (f: FeatureWrapper) => void;
  onDelete: (f: FeatureWrapper) => void;
  onSelect: (f: FeatureWrapper) => void;
  onEdit: (f: FeatureWrapper) => void;
}

// [k: feature id]: state
type RowStateMap = { [k: string]: FeatureRowPersistentState | undefined };

export function FeatureList(props: Props) {
  const { t } = useTranslation('MapView');
  const { features, mainField, onHighlight, onZoomOn, onDelete, onSelect, onEdit } = props;
  const [rowStates, setRowStates] = useState<RowStateMap>({});

  const containerRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: features.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => featureRowClosedHeight(),
    overscan: 10,
  });

  const handleStateChange = useCallback((featureId: string, state: Partial<FeatureRowPersistentState>) => {
    setRowStates((states) => {
      const completeState: FeatureRowPersistentState = {
        open: false,
        ...states[featureId],
        ...state,
      };

      return { ...states, [featureId]: completeState };
    });
  }, []);

  const listStyle: CSSProperties = useMemo(
    () => ({
      height: `100%`,
      overflow: 'auto',
    }),
    []
  );

  const innerStyle: CSSProperties = useMemo(
    () => ({
      height: `${virtualizer.getTotalSize()}px`,
      width: '100%',
      position: 'relative',
    }),
    [virtualizer]
  );

  return (
    <div ref={containerRef} style={listStyle}>
      <div style={innerStyle}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const index = virtualItem.index;
          const feature = features[index];
          const featureId = feature.getId();
          if (typeof featureId !== 'string') {
            return <div key={virtualItem.key}>{t('Invalid_feature')}</div>;
          }

          return (
            <div
              key={virtualItem.key}
              // We mesure element height. data-index attribute is needed by virtualizer.measureElement()
              ref={virtualizer.measureElement}
              data-index={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <FeatureRow
                index={index}
                feature={feature}
                onHighlight={onHighlight}
                mainField={mainField}
                onZoomOn={onZoomOn}
                onDelete={onDelete}
                onSelect={onSelect}
                onEdit={onEdit}
                persistentState={rowStates[featureId]}
                onPersistentStateChange={handleStateChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
