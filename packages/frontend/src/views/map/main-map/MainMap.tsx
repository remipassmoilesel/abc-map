import React, { Component, DragEvent, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { AbcFile } from '@abc-map/frontend-commons';
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

export class MainMap extends Component<Props, State> {
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      dragOverlay: false,
    };
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
    const div = this.mapRef.current;
    if (!div) {
      return logger.error('Cannot mount map, div reference not ready');
    }

    this.initializeMap(div);
  }

  public componentWillUnmount() {
    this.cleanupMap();
  }

  private initializeMap(div: HTMLDivElement): void {
    logger.info('Initializing map');
    this.props.map.setTarget(div);
  }

  private cleanupMap() {
    this.props.map.setTarget(undefined);
  }

  private handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    const { dataStore, history, toasts } = this.props.services;
    ev.preventDefault();

    const files: AbcFile[] = Array.from(ev.dataTransfer.files).map((f) => ({ path: f.name, content: f }));
    if (!files.length) {
      toasts.info('Vous devez sélectionner un ou plusieurs fichiers');
      return;
    }

    toasts.info('Import en cours ...');
    dataStore
      .importFiles(files)
      .then((res) => {
        if (!res.layers.length) {
          toasts.error("Ces formats de fichiers ne sont pas supportés, aucune donnée n'a été importée");
          return;
        }

        history.register(HistoryKey.Map, new AddLayersTask(this.props.map, res.layers));
        toasts.info('Import terminé !');
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });

    this.setState({ dragOverlay: false });
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
