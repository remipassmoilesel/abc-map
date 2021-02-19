import React, { Component, ReactNode } from 'react';
import { services } from '../../../../core/Services';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { RemoveFeatureTask } from '../../../../core/history/tasks/RemoveFeatureTask';
import { AddFeaturesTask } from '../../../../core/history/tasks/AddFeaturesTask';
import { Logger } from '../../../../core/utils/Logger';
import StrokeWidthSelector from '../_common/StrokeWidthSelector';
import ColorSelector from '../_common/color-selector/ColorSelector';
import FillPatternSelector from '../_common/pattern-selector/FillPatternSelector';
import { FeatureWrapper } from '../../../../core/geo/features/FeatureWrapper';
import './SelectionPanel.scss';

const logger = Logger.get('SelectionPanel.tsx');

class SelectionPanel extends Component<{}, {}> {
  private services = services();

  public render(): ReactNode {
    return (
      <div className={'abc-selection-panel'}>
        <StrokeWidthSelector />
        <ColorSelector withFillColors={true} />
        <FillPatternSelector />
        <button className={'btn btn-outline-secondary'} onClick={this.handleDelete} data-cy={'delete-selection'}>
          <i className={'fa fa-trash'} />
          Supprimer
        </button>
        <button className={'btn btn-outline-secondary'} onClick={this.handleDuplicate} data-cy={'duplicate-selection'}>
          <i className={'fa fa-copy'} />
          Dupliquer
        </button>
      </div>
    );
  }

  private handleDelete = () => {
    const map = this.services.geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    if (!layer) {
      return;
    }

    const features = map.getSelectedFeatures();
    if (!features.length) {
      this.services.ui.toasts.info("Vous devez d'abord sélectionner des objets");
      return;
    }

    features.forEach((feat) => layer.unwrap().getSource().removeFeature(feat.unwrap()));
    this.services.history.register(HistoryKey.Map, new RemoveFeatureTask(layer.unwrap().getSource(), features));
  };

  private handleDuplicate = () => {
    const map = this.services.geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    if (!layer) {
      return;
    }

    const features = map.getSelectedFeatures();
    if (!features.length) {
      this.services.ui.toasts.info("Vous devez d'abord sélectionner des objets");
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

    clones.forEach((clone) => layer.unwrap().getSource().addFeature(clone.unwrap()));
    this.services.history.register(HistoryKey.Map, new AddFeaturesTask(layer.unwrap().getSource(), clones));
  };
}

export default SelectionPanel;
