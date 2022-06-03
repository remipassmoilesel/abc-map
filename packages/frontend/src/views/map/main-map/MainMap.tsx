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

import Cls from './MainMap.module.scss';
import React, { Component, DragEvent, ReactNode } from 'react';
import { AbcFile, Logger, ProjectConstants } from '@abc-map/shared';
import throttle from 'lodash/throttle';
import { ServiceProps, withServices } from '../../../core/withServices';
import { TileLoadErrorEvent } from '../../../core/geo/map/MapWrapper.events';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { InteractiveAttributions } from '../../../components/interactive-attributions/InteractiveAttributions';
import { Zoom } from './zoom/Zoom';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import BaseEvent from 'ol/events/Event';
import { DataReader } from '../../../core/data/DataReader';
import { ReadStatus } from '../../../core/data/ReadResult';
import { Scale } from '../../../components/scale/Scale';
import { Preloader } from './preloader/Preloader';
import clsx from 'clsx';

export const logger = Logger.get('MainMap.ts');

const t = prefixedTranslation('MapView:MainMap.');

interface State {
  dragOverlay: boolean;
  tileError: string;
}

class MainMap extends Component<ServiceProps, State> {
  private map: MapWrapper;
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: ServiceProps) {
    super(props);
    this.map = props.services.geo.getMainMap();
    this.state = { dragOverlay: false, tileError: '' };
  }

  public render(): ReactNode {
    const tileError = this.state.tileError;
    const dragOverlay = this.state.dragOverlay;

    return (
      <div className={Cls.mapContainer}>
        {/* Main map support */}
        <div ref={this.mapRef} data-cy={'main-map'} className={Cls.map} onDragOver={this.handleDragOver} />

        <InteractiveAttributions map={this.map} className={Cls.attributions} />

        <div className={Cls.bottomBar}>
          <div className={'d-flex align-items-center'}>
            <Scale map={this.map} className={clsx(Cls.scale, 'mr-2')} />
            <Preloader map={this.map} />
          </div>

          <Zoom map={this.map} />
        </div>

        {/* Warning if tiles does not load */}
        {tileError && (
          <div className={Cls.tileLoadError} onClick={this.handleDismissTileError}>
            {tileError} <FaIcon icon={IconDefs.faTimes} className={'ml-2'} />
          </div>
        )}

        {/* Overlay shown just before drag and drop */}
        {dragOverlay && (
          <>
            <div className={Cls.dropOverlay1}>
              <FaIcon icon={IconDefs.faFile} size={'5rem'} />
              <h1>{t('Drop_your_files')}</h1>
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
    const { project } = this.props.services;

    this.initializeMap();
    project.addProjectLoadedListener(this.handleNewProject);
  }

  public componentWillUnmount() {
    const { project } = this.props.services;

    this.cleanupMap();
    project.removeProjectLoadedListener(this.handleNewProject);
  }

  private initializeMap(): void {
    const { map } = this;

    logger.info('Initializing map');
    const mapSupport = this.mapRef.current;
    if (!mapSupport) {
      logger.error('Cannot mount map, div reference not ready', { mapSupport });
      return;
    }

    map.setTarget(mapSupport);
    map.addTileErrorListener(this.handleTileError);

    map.unwrap().on('error', this.handleMapError);
  }

  private cleanupMap() {
    const { map } = this;

    map.setTarget(undefined);
    map.removeTileErrorListener(this.handleTileError);

    map.unwrap().un('error', this.handleMapError);
  }

  private handleMapError = (ev: BaseEvent) => {
    const { toasts } = this.props.services;

    logger.error('Map error: ', ev);
    toasts.genericError();
  };

  private handleNewProject = () => {
    this.setState({ tileError: '' });
  };

  private handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    const { toasts } = this.props.services;
    const dataReader = DataReader.create();

    ev.preventDefault();
    this.setState({ dragOverlay: false });

    const files: AbcFile<Blob>[] = Array.from(ev.dataTransfer.files).map((f) => ({ path: f.name, content: f }));
    if (!files.length) {
      toasts.info(t('You_must_select_files'));
      return;
    }

    const project = files.find((f) => f.path.toLocaleLowerCase().endsWith(ProjectConstants.FileExtension));
    if (project) {
      toasts.info(t('You_must_import_project_with_import_control'));
      return;
    }

    const firstToast = toasts.info(t('Import_in_progress'));
    dataReader
      .importFiles(files)
      .then((result) => {
        if (result.status === ReadStatus.Succeed) {
          toasts.info(t('Done'));
        } else if (result.status === ReadStatus.Failed) {
          toasts.error(t('Formats_not_supported'));
        }
      })
      .catch((err) => {
        logger.error('Import error: ', err);
        toasts.genericError();
      })
      .finally(() => toasts.dismiss(firstToast));
  };

  private handleDragOver = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    this.setState({ dragOverlay: true });
  };

  private handleDragLeave = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    this.setState({ dragOverlay: false });
  };

  private handleTileError = throttle((ev: TileLoadErrorEvent) => {
    this.setState({ tileError: t('Layer_does_not_load', { name: ev.layer.getName() || t('Layer_without_name') }) });
  }, 1000);

  private handleDismissTileError = () => {
    this.setState({ tileError: '' });
  };
}

export default withTranslation()(withServices(MainMap));
