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

import React from 'react';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import { MainState } from '../../../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { GeometryType } from '@abc-map/shared';
import { FeatureWrapper } from '../../../../../core/geo/features/FeatureWrapper';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddFeaturesTask } from '../../../../../core/history/tasks/features/AddFeaturesTask';
import { RemoveFeaturesTask } from '../../../../../core/history/tasks/features/RemoveFeaturesTask';
import Cls from './ButtonBar.module.scss';

const mapStateToProps = (state: MainState) => ({
  stroke: state.map.currentStyle.stroke,
  fill: state.map.currentStyle.fill,
  text: state.map.currentStyle.text,
  point: state.map.currentStyle.point,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class ButtonBar extends React.Component<Props, {}> {
  public render() {
    return (
      <div className={Cls.buttonBar}>
        {/* Apply style on selected features */}
        <button
          onClick={this.handleApplyStyle}
          title={'Appliquer le style courant aux géométries sélectionnées'}
          className={'btn btn-link'}
          data-testid={'apply-style'}
        >
          <i className={'fa fa-paint-roller'} />
        </button>

        {/* Duplicate selected features  */}
        <button
          onClick={this.handleDuplicate}
          title={'Dupliquer les géométries sélectionnées'}
          className={'btn btn-link'}
          data-cy={'duplicate-selection'}
          data-testid={'duplicate-selection'}
        >
          <i className={'fa fa-clone'} />
        </button>

        {/* Delete selected features */}
        <button onClick={this.handleDeleteFeatures} title={'Supprimer les géométries sélectionnées'} className={'btn btn-link'} data-testid={'delete-features'}>
          <i className={'fa fa-trash'} />
        </button>

        {/* Unselect all features */}
        <button onClick={this.handleUnselectAll} title={'Désélectionner tout'} className={'btn btn-link'}>
          <i className={'fa fa-times-circle'} />
        </button>

        {/* Move selected features behind */}
        <button onClick={this.handleMoveAhead} title={"Géométries sélectionnées vers l'avant"} className={'btn btn-link'} data-testid={'move-features-forward'}>
          <i className={'fa fa-arrow-up'} />
        </button>

        {/* Move selected features ahead */}
        <button
          onClick={this.handleMoveBehind}
          title={"Géométries sélectionnées vers l'arrière"}
          className={'btn btn-link'}
          data-testid={'move-features-behind'}
        >
          <i className={'fa fa-arrow-down'} />
        </button>
      </div>
    );
  }

  private handleApplyStyle = () => {
    const { geo, toasts } = this.props.services;
    const strokeColor = this.props.stroke?.color;
    const strokeWidth = this.props.stroke?.width;
    const icon = this.props.point?.icon;
    const iconColor = this.props.point?.color;
    const iconSize = this.props.point?.size;
    const fillColor1 = this.props.fill?.color1;
    const fillColor2 = this.props.fill?.color2;
    const fillPattern = this.props.fill?.pattern;

    const changes = geo.updateSelectedFeatures((style, feature) => {
      const type = feature.getGeometry()?.getType();
      if (!type) {
        return;
      }

      if ([GeometryType.POINT, GeometryType.MULTI_POINT].includes(type)) {
        return {
          ...style,
          point: {
            ...style.point,
            icon,
            size: iconSize,
            color: iconColor,
          },
        };
      }
      // Lines
      else if ([GeometryType.LINE_STRING, GeometryType.MULTI_LINE_STRING].includes(type)) {
        return {
          ...style,
          stroke: {
            ...style.stroke,
            color: strokeColor,
            width: strokeWidth,
          },
        };
      }
      // Polygons
      else if ([GeometryType.POLYGON, GeometryType.MULTI_POLYGON].includes(type)) {
        return {
          ...style,
          stroke: {
            ...style.stroke,
            color: strokeColor,
            width: strokeWidth,
          },
          fill: {
            ...style.fill,
            color1: fillColor1,
            color2: fillColor2,
            pattern: fillPattern,
          },
        };
      }
    });

    if (!changes) {
      toasts.info("Vous devez d'abord sélectionner des objets");
    }
  };

  private handleDuplicate = () => {
    const { geo, toasts, history } = this.props.services;
    const map = geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    if (!layer) {
      return;
    }

    const features = map.getSelectedFeatures();
    if (!features.length) {
      toasts.info("Vous devez d'abord sélectionner des objets");
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
  };

  private handleDeleteFeatures = () => {
    const { history, geo, toasts } = this.props.services;

    const map = geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    const features = map.getSelectedFeatures();
    if (!layer || !features.length) {
      toasts.info("Vous devez d'abord sélectionner des objets");
      return;
    }

    features.forEach((f) => layer.getSource().removeFeature(f.unwrap()));
    history.register(HistoryKey.Map, new RemoveFeaturesTask(layer.getSource(), features));
  };

  private handleMoveBehind = () => {
    const { geo, toasts } = this.props.services;

    const changes = geo.updateSelectedFeatures((s) => ({ ...s, zIndex: (s.zIndex || 0) - 1 }));
    if (!changes) {
      toasts.info("Vous devez d'abord sélectionner des objets");
    }
  };

  private handleMoveAhead = () => {
    const { geo, toasts } = this.props.services;

    const changes = geo.updateSelectedFeatures((s) => ({ ...s, zIndex: (s.zIndex || 0) + 1 }));
    if (!changes) {
      toasts.info("Vous devez d'abord sélectionner des objets");
    }
  };

  private handleUnselectAll = () => {
    const { geo, toasts } = this.props.services;

    const selected = geo.getMainMap().getSelectedFeatures();
    if (!selected) {
      toasts.info("Vous devez d'abord sélectionner des objets");
    }

    selected.forEach((f) => f.setSelected(false));
  };
}

export default withServices(connector(ButtonBar));
