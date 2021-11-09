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
import { FeatureStyle, GeometryType } from '@abc-map/shared';
import { FeatureWrapper } from '../../../../../core/geo/features/FeatureWrapper';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddFeaturesTask } from '../../../../../core/history/tasks/features/AddFeaturesTask';
import { RemoveFeaturesTask } from '../../../../../core/history/tasks/features/RemoveFeaturesTask';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import Cls from './CommonActions.module.scss';
import { useAppSelector } from '../../../../../core/store/hooks';
import { useServices } from '../../../../../core/hooks';

const t = prefixedTranslation('MapView:ToolSelector.');

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
      if ([GeometryType.POINT, GeometryType.MULTI_POINT].includes(type)) {
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
      if ([GeometryType.LINE_STRING, GeometryType.MULTI_LINE_STRING].includes(type)) {
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
      if ([GeometryType.POLYGON, GeometryType.MULTI_POLYGON].includes(type)) {
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
      .filter((feat) => !!feat) as FeatureWrapper[];

    layer.getSource().addFeatures(clones.map((c) => c.unwrap()));
    history.register(HistoryKey.Map, new AddFeaturesTask(layer.getSource(), clones));
  }, [geo, history, toasts]);

  const handleDeleteFeatures = useCallback(() => {
    const map = geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    const features = map.getSelectedFeatures();
    if (!layer || !features.length) {
      toasts.info(t('You_must_select_geometries_first'));
      return;
    }

    features.forEach((f) => layer.getSource().removeFeature(f.unwrap()));
    history.register(HistoryKey.Map, new RemoveFeaturesTask(layer.getSource(), features));
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
    const selected = geo.getMainMap().getSelectedFeatures();
    if (!selected) {
      toasts.info(t('You_must_select_geometries_first'));
    }

    selected.forEach((f) => f.setSelected(false));
  }, [geo, toasts]);

  return (
    <div className={Cls.commonActions}>
      {/* Apply style on selected features */}
      <button onClick={handleApplyStyle} title={t('Apply_style_to_selected_geometries')} className={'btn btn-link'} data-testid={'apply-style'}>
        <i className={'fa fa-paint-roller'} />
      </button>

      {/* Duplicate selected features  */}
      <button
        onClick={handleDuplicate}
        title={t('Duplicate_selected_geometries')}
        className={'btn btn-link'}
        data-cy={'duplicate-selection'}
        data-testid={'duplicate-selection'}
      >
        <i className={'fa fa-clone'} />
      </button>

      {/* Delete selected features */}
      <button onClick={handleDeleteFeatures} title={t('Delete_selected_geometries')} className={'btn btn-link'} data-testid={'delete-features'}>
        <i className={'fa fa-trash'} />
      </button>

      {/* Unselect all features */}
      <button onClick={handleUnselectAll} title={t('Unselect_all')} className={'btn btn-link'}>
        <i className={'fa fa-times-circle'} />
      </button>

      {/* Move selected features behind */}
      <button onClick={handleMoveAhead} title={t('Move_geometries_up')} className={'btn btn-link'} data-testid={'move-features-forward'}>
        <i className={'fa fa-arrow-up'} />
      </button>

      {/* Move selected features ahead */}
      <button onClick={handleMoveBehind} title={t('Move_geometries_down')} className={'btn btn-link'} data-testid={'move-features-behind'}>
        <i className={'fa fa-arrow-down'} />
      </button>
    </div>
  );
}

export default CommonActions;
