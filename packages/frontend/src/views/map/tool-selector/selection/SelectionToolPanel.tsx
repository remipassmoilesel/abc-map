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

import React, { Component, ReactNode } from 'react';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { AddFeaturesTask } from '../../../../core/history/tasks/features/AddFeaturesTask';
import { Logger } from '@abc-map/shared';
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../../../../components/color-picker/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import { FeatureWrapper } from '../../../../core/geo/features/FeatureWrapper';
import TextFormat from '../_common/text-format/TextFormat';
import { ServiceProps, withServices } from '../../../../core/withServices';
import Cls from './SelectionToolPanel.module.scss';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/user-documentation';
import PointIconSelector from '../point/icon-selector/PointIconSelector';
import PointSizeSelector from '../point/size-selector/PointSizeSelector';
import ZIndex from '../_common/z-index/ZIndex';

const logger = Logger.get('SelectionToolPanel.tsx');

class SelectionToolPanel extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.selectionPanel}>
        <TipBubble id={ToolTips.Selection} label={"Aide de l'outil"} className={'mx-3 mb-3'} />
        <button className={`btn btn-outline-secondary mb-3`} onClick={this.handleDuplicate} data-cy={'duplicate-selection'}>
          <i className={'fa fa-copy mr-3'} />
          Dupliquer
        </button>
        <ZIndex />

        <div className={Cls.section}>Points</div>
        <PointIconSelector />
        <PointSizeSelector />
        <ColorSelector point={true} />

        <div className={Cls.section}>Lignes et polygones</div>
        <StrokeWidthSelector />
        <ColorSelector point={false} stroke={true} fillColor1={true} fillColor2={true} />
        <FillPatternSelector />

        <div className={Cls.section}>Texte</div>
        <TextFormat />
      </div>
    );
  }

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

    clones.forEach((clone) => layer.getSource().addFeature(clone.unwrap()));
    history.register(HistoryKey.Map, new AddFeaturesTask(layer.getSource(), clones));
  };
}

export default withServices(SelectionToolPanel);
