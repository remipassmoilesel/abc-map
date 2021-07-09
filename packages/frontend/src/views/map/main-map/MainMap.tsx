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

import React, { Component, DragEvent, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { AbcFile } from '@abc-map/shared';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../core/history/tasks/layers/AddLayersTask';
import { ServiceProps, withServices } from '../../../core/withServices';
import Cls from './MainMap.module.scss';

export const logger = Logger.get('MainMap.ts', 'debug');

interface LocalProps {
  map: MapWrapper;
}

interface State {
  dragOverlay: boolean;
}

declare type Props = LocalProps & ServiceProps;

class MainMap extends Component<Props, State> {
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { dragOverlay: false };
  }

  public render(): ReactNode {
    const dragOverlay = this.state.dragOverlay;

    return (
      <div className={Cls.mapContainer}>
        <div ref={this.mapRef} data-cy={'main-map'} className={Cls.map} onDragOver={this.handleDragOver} />
        {dragOverlay && (
          <>
            <div className={Cls.dropOverlay1}>
              <i className={'fa fa-file'} />
              <h1>Déposez vos fichiers pour les importer</h1>
            </div>
            <div
              className={Cls.dropOverlay2}
              data-cy={'drag-overlay'}
              onDrop={this.handleDrop}
              onDragOver={this.handleDragOver}
              onDragLeave={this.handleDragLeave}
            />
          </>
        )}
      </div>
    );
  }

  public componentDidMount() {
    this.initializeMap();
  }

  public componentWillUnmount() {
    this.cleanupMap();
  }

  private initializeMap(): void {
    logger.info('Initializing map');
    const div = this.mapRef.current;
    if (!div) {
      logger.error('Cannot mount map, div reference not ready');
      return;
    }

    this.props.map.setTarget(div);
  }

  private cleanupMap() {
    this.props.map.setTarget(undefined);
  }

  private handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    const { dataStore, history, toasts, modals } = this.props.services;
    ev.preventDefault();

    const files: AbcFile<Blob>[] = Array.from(ev.dataTransfer.files).map((f) => ({ path: f.name, content: f }));
    if (!files.length) {
      toasts.info('Vous devez sélectionner un ou plusieurs fichiers');
      return;
    }

    this.setState({ dragOverlay: false });

    const importFiles = async () => {
      const result = await dataStore.importFiles(files);

      if (!result.layers.length) {
        toasts.error("Ces formats de fichiers ne sont pas supportés, aucune donnée n'a été importée");
        return;
      }

      history.register(HistoryKey.Map, new AddLayersTask(this.props.map, result.layers));
      toasts.info('Import terminé !');
    };

    modals.longOperationModal(importFiles).catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  };

  private handleDragOver = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    this.setState({ dragOverlay: true });
  };

  private handleDragLeave = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    this.setState({ dragOverlay: false });
  };
}

export default withServices(MainMap);
