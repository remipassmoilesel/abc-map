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
import { AbcFile, Logger, ProjectConstants } from '@abc-map/shared';
import throttle from 'lodash/throttle';
import { ServiceProps, withServices } from '../../../core/withServices';
import { ImportStatus } from '../../../core/data/DataService';
import { OperationStatus } from '../../../core/ui/typings';
import { TileLoadErrorEvent } from '../../../core/geo/map/MapWrapper.events';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { Control, ScaleLine } from 'ol/control';
import { Attributions } from './attributions/Attributions';
import { Zoom } from './zoom/Zoom';
import { WithTooltip } from '../../../components/with-tooltip/WithTooltip';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import Cls from './MainMap.module.scss';
import BaseEvent from 'ol/events/Event';

export const logger = Logger.get('MainMap.ts');

interface State {
  dragOverlay: boolean;
  tileError: string;
}

const t = prefixedTranslation('MapView:MainMap.');

class MainMap extends Component<ServiceProps, State> {
  private map: MapWrapper;
  private mapRef = React.createRef<HTMLDivElement>();
  private scaleRef = React.createRef<HTMLDivElement>();
  private controls: Control[] = [];

  constructor(props: ServiceProps) {
    super(props);
    this.map = props.services.geo.getMainMap();
    this.state = { dragOverlay: false, tileError: '' };
  }

  public render(): ReactNode {
    const tileError = this.state.tileError;
    const dragOverlay = this.state.dragOverlay;

    return (
      <div className={`${Cls.mapContainer} abc-main-map`}>
        {/* Main map support */}
        <div ref={this.mapRef} data-cy={'main-map'} className={Cls.map} onDragOver={this.handleDragOver} />

        <div className={Cls.bottomBar}>
          <div className={Cls.scale}>
            <WithTooltip title={t('Scale')} placement={'top'}>
              <div ref={this.scaleRef} />
            </WithTooltip>
          </div>
          <div className={Cls.controls}>
            <Attributions />
            <Zoom />
          </div>
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
    const scaleSupport = this.scaleRef.current;
    if (!mapSupport || !scaleSupport) {
      logger.error('Cannot mount map, div reference not ready', {
        mapSupport,
        scaleSupport,
      });
      return;
    }

    map.setTarget(mapSupport);
    map.addTileErrorListener(this.handleTileError);

    const scale = new ScaleLine({ units: 'metric', target: scaleSupport });

    this.controls = [scale];
    this.controls.forEach((c) => map.unwrap().addControl(c));

    map.unwrap().on('error', this.handleMapError);
  }

  private cleanupMap() {
    const { map } = this;

    map.setTarget(undefined);
    map.removeTileErrorListener(this.handleTileError);

    this.controls.forEach((c) => map.unwrap().removeControl(c));

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
    const { data, toasts, modals } = this.props.services;
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

    const importFiles = async () => {
      const result = await data.importFiles(files);

      if (result.status === ImportStatus.Failed) {
        toasts.error(t('Formats_not_supported'));
        return OperationStatus.Interrupted;
      }

      if (result.status === ImportStatus.Canceled) {
        return OperationStatus.Interrupted;
      }

      return OperationStatus.Succeed;
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

  private handleTileError = throttle((ev: TileLoadErrorEvent) => {
    this.setState({ tileError: t('Layer_does_not_load', { name: ev.layer.getName() || t('Layer_without_name') }) });
  }, 1000);

  private handleDismissTileError = () => {
    this.setState({ tileError: '' });
  };
}

export default withTranslation()(withServices(MainMap));
