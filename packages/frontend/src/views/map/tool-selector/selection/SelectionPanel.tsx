import React, { Component, ReactNode } from 'react';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { RemoveFeaturesTask } from '../../../../core/history/tasks/features/RemoveFeaturesTask';
import { AddFeaturesTask } from '../../../../core/history/tasks/features/AddFeaturesTask';
import { Logger } from '@abc-map/frontend-commons';
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../_common/color-selector/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import { FeatureWrapper } from '../../../../core/geo/features/FeatureWrapper';
import TextFormat from '../_common/text-format/TextFormat';
import { ServiceProps, withServices } from '../../../../core/withServices';
import Cls from './SelectionPanel.module.scss';

const logger = Logger.get('SelectionPanel.tsx');

class SelectionPanel extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.selectionPanel}>
        <button className={`btn btn-outline-secondary ${Cls.button}`} onClick={this.handleDelete} data-cy={'delete-selection'}>
          <i className={'fa fa-trash'} />
          Supprimer
        </button>
        <button className={`btn btn-outline-secondary ${Cls.button}`} onClick={this.handleDuplicate} data-cy={'duplicate-selection'}>
          <i className={'fa fa-copy'} />
          Dupliquer
        </button>
        <StrokeWidthSelector />
        <ColorSelector stroke={true} fillColor1={true} fillColor2={true} />
        <FillPatternSelector />
        <TextFormat />
      </div>
    );
  }

  private handleDelete = () => {
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

    features.forEach((feat) => layer.getSource().removeFeature(feat.unwrap()));
    history.register(HistoryKey.Map, new RemoveFeaturesTask(layer.getSource(), features));
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

    clones.forEach((clone) => layer.getSource().addFeature(clone.unwrap()));
    history.register(HistoryKey.Map, new AddFeaturesTask(layer.getSource(), clones));
  };
}

export default withServices(SelectionPanel);
