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

import React, { useCallback } from 'react';
import { FeatureStyle, AbcGeometryType, Logger } from '@abc-map/shared';
import { FeatureWrapper } from '../../../../../core/geo/features/FeatureWrapper';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddFeaturesChangeset } from '../../../../../core/history/changesets/features/AddFeaturesChangeset';
import { RemoveFeaturesChangeset } from '../../../../../core/history/changesets/features/RemoveFeaturesChangeset';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import Cls from './CommonActions.module.scss';
import { useAppSelector } from '../../../../../core/store/hooks';
import { useServices } from '../../../../../core/useServices';
import { ActionButton } from './ActionButton';
import { IconDefs } from '../../../../../components/icon/IconDefs';

const logger = Logger.get('CommonActions.tsx');

const t = prefixedTranslation('MapView:');

function CommonActions() {
  const { geo, toasts, history } = useServices();

  const stroke = useAppSelector((st) => st.map.currentStyle.stroke);
  const fill = useAppSelector((st) => st.map.currentStyle.fill);
  const text = useAppSelector((st) => st.map.currentStyle.text);
  const point = useAppSelector((st) => st.map.currentStyle.point);

  const handleApplyStyle = useCallback(() => {
    const changes = geo.updateSelectedFeatures((style, feature) => {
      const type = feature.getGeometry()?.getType();
      if (!type) {
        return;
      }

      let newStyle: FeatureStyle | undefined;
      if (style.text?.value) {
        newStyle = { ...style, text: { ...style.text, ...text } };
      }

      // Point
      if ([AbcGeometryType.POINT, AbcGeometryType.MULTI_POINT].find((t) => t === type)) {
        newStyle = {
          ...style,
          ...newStyle,
          point: {
            ...style.point,
            icon: point.icon,
            size: point.size,
            color: point.color,
          },
        };
      }

      // Lines
      if ([AbcGeometryType.LINE_STRING, AbcGeometryType.MULTI_LINE_STRING].find((t) => t === type)) {
        newStyle = {
          ...style,
          ...newStyle,
          stroke: {
            ...style.stroke,
            color: stroke.color,
            width: stroke.width,
          },
        };
      }

      // Polygons
      if ([AbcGeometryType.POLYGON, AbcGeometryType.MULTI_POLYGON].find((t) => t === type)) {
        newStyle = {
          ...style,
          ...newStyle,
          stroke: {
            ...style.stroke,
            color: stroke.color,
            width: stroke.width,
          },
          fill: {
            ...style.fill,
            color1: fill.color1,
            color2: fill.color2,
            pattern: fill.pattern,
          },
        };
      }

      return newStyle;
    });

    if (!changes) {
      toasts.info(t('You_must_select_geometries_first'));
    }
  }, [fill.color1, fill.color2, fill.pattern, geo, point.color, point.icon, point.size, stroke.color, stroke.width, text, toasts]);

  const handleDuplicate = useCallback(() => {
    const map = geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    if (!layer) {
      return;
    }

    const features = map.getSelectedFeatures();
    if (!features.length) {
      toasts.info(t('You_must_select_geometries_first'));
      return;
    }

    features.forEach((feat) => feat.setSelected(false));

    const clones = features
      .map((feat) => {
        const clone = feat.clone();
        const geom = clone.getGeometry();
        if (!geom) {
          return null;
        }

        // We generate a new id
        clone.setId();
        clone.setSelected(true);

        // We translate new geometries
        const resolution = map.unwrap().getView().getResolution() || 1;
        const dx = resolution * 30;
        const dy = resolution * 30;
        clone.getGeometry()?.translate(dx, -dy);

        return clone;
      })
      .filter((feat): feat is FeatureWrapper => !!feat);

    const cs = new AddFeaturesChangeset(layer.getSource(), clones);
    cs.apply().catch((err) => logger.error('Cannot clone features: ', err));
    history.register(HistoryKey.Map, cs);
  }, [geo, history, toasts]);

  const handleDeleteFeatures = useCallback(() => {
    const map = geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    const features = map.getSelectedFeatures();
    if (!layer || !features.length) {
      toasts.info(t('You_must_select_geometries_first'));
      return;
    }

    features.forEach((f) => f.setSelected(false));

    const cs = new RemoveFeaturesChangeset(layer.getSource(), features);
    cs.apply().catch((err) => logger.error('Cannot delete features: ', err));
    history.register(HistoryKey.Map, cs);
  }, [geo, history, toasts]);

  const handleMoveBehind = useCallback(() => {
    const changes = geo.updateSelectedFeatures((s) => ({ ...s, zIndex: (s.zIndex || 0) - 1 }));
    if (!changes) {
      toasts.info(t('You_must_select_geometries_first'));
    }
  }, [geo, toasts]);

  const handleMoveAhead = useCallback(() => {
    const changes = geo.updateSelectedFeatures((s) => ({ ...s, zIndex: (s.zIndex || 0) + 1 }));
    if (!changes) {
      toasts.info(t('You_must_select_geometries_first'));
    }
  }, [geo, toasts]);

  const handleUnselectAll = useCallback(() => {
    const deselected = geo.deselectAllFeatures();
    if (!deselected) {
      toasts.info(t('You_must_select_geometries_first'));
    }
  }, [geo, toasts]);

  return (
    <div className={Cls.commonActions}>
      {/* Unselect all features */}
      <ActionButton onClick={handleUnselectAll} title={t('Unselect_all')} icon={IconDefs.faTimesCircle} />

      {/* Duplicate selected features  */}
      <ActionButton
        onClick={handleDuplicate}
        title={t('Duplicate_selected_geometries')}
        icon={IconDefs.faClone}
        data-cy={'duplicate-selection'}
        data-testid={'duplicate-selection'}
      />

      {/* Apply style on selected features */}
      <ActionButton onClick={handleApplyStyle} title={t('Apply_style_to_selected_geometries')} icon={IconDefs.faPaintRoller} data-testid={'apply-style'} />

      {/* Delete selected features */}
      <ActionButton onClick={handleDeleteFeatures} title={t('Delete_selected_geometries')} icon={IconDefs.faTrash} data-testid={'delete-features'} />

      {/* Move selected features up */}
      <ActionButton onClick={handleMoveAhead} title={t('Move_geometries_up')} icon={IconDefs.faArrowUp} data-testid={'move-features-forward'} />

      {/* Move selected features down */}
      <ActionButton onClick={handleMoveBehind} title={t('Move_geometries_down')} icon={IconDefs.faArrowDown} data-testid={'move-features-behind'} />
    </div>
  );
}

export default CommonActions;
