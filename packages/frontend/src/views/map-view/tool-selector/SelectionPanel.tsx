import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { RemoveFeatureTask } from '../../../core/history/tasks/RemoveFeatureTask';
import { FeatureHelper } from '../../../core/geo/features/FeatureHelper';
import { AddFeaturesTask } from '../../../core/history/tasks/AddFeaturesTask';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { Logger } from '../../../core/utils/Logger';
import './SelectionPanel.scss';

const logger = Logger.get('SelectionPanel');

class SelectionPanel extends Component<{}, {}> {
  private services = services();

  public render(): ReactNode {
    return (
      <div className={'abc-selection-panel'}>
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

    features.forEach((feat) => layer.getSource().removeFeature(feat));
    this.services.history.register(HistoryKey.Map, new RemoveFeatureTask(layer.getSource(), features));
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

    features.forEach((feat) => FeatureHelper.setSelected(feat, false));

    const clones = features
      .map((feat) => {
        const clone = FeatureHelper.clone(feat);
        const geom = clone.getGeometry();
        if (!geom) {
          return null;
        }

        FeatureHelper.setId(clone); // We generate a new id
        FeatureHelper.setSelected(clone, true);

        const resolution = map.getInternal().getView().getResolution() || 1;
        const dx = resolution * 10;
        const dy = resolution * 10;
        clone.getGeometry()?.translate(dx, -dy);

        return clone;
      })
      .filter((feat) => !!feat) as Feature<Geometry>[];

    clones.forEach((clone) => layer.getSource().addFeature(clone));
    this.services.history.register(HistoryKey.Map, new AddFeaturesTask(layer.getSource(), clones));
  };
}

export default SelectionPanel;
