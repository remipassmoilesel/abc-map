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
import { getAbcWindow, Logger } from '@abc-map/shared';
import { AbcLayout } from '@abc-map/shared';
import { LayoutHelper } from '../../../core/project/LayoutHelper';
import View from 'ol/View';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { PreviewDimensions } from './PreviewDimensions';
import * as _ from 'lodash';
import { E2eMapWrapper } from '../../../core/geo/map/E2eMapWrapper';
import Cls from './LayoutPreview.module.scss';

const logger = Logger.get('LayoutPreview.tsx', 'warn');

interface Props {
  layout?: AbcLayout;
  mainMap: MapWrapper;
  onLayoutChanged: (lay: AbcLayout) => void;
  onNewLayout: () => void;
}

interface State {
  previewMap?: MapWrapper;
}

class LayoutPreview extends Component<Props, State> {
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const layout = this.props.layout;
    const handleNewLayout = this.props.onNewLayout;

    return (
      <div className={Cls.layoutPreview} data-cy={'layout-preview'}>
        <h3>{layout?.name}</h3>
        {layout && (
          <div className={Cls.previewContainer}>
            <div className={Cls.previewFrame} ref={this.mapRef} data-cy={'layout-preview-map'} />
          </div>
        )}
        {!layout && (
          <div className={Cls.noLayout}>
            <i className={'fa fa-print'} />
            <div>Exportez ou imprimez votre carte en créant une page.</div>
            <button onClick={handleNewLayout} className={'btn btn-primary mt-3'} data-cy={'new-layout'}>
              Créer une page A4
            </button>
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.layout) {
      this.updateMap(this.props.layout);
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    if (!_.isEqual(prevProps.layout, this.props.layout)) {
      this.updateMap(this.props.layout);
    }
  }

  public componentWillUnmount() {
    this.state.previewMap?.dispose();
  }

  private updateMap(layout?: AbcLayout): void {
    logger.info('Updating preview map', layout);

    if (!layout) {
      this.state.previewMap?.dispose();
      this.setState({ previewMap: undefined });
      return;
    }

    const div = this.mapRef.current;
    if (!div) {
      logger.error('Cannot update map: ', { div });
      return;
    }

    // Map iniotialization
    const mainMap = this.props.mainMap;
    const previewMap = this.state.previewMap || this.initializePreviewMap(div);

    const divSize = this.getPreviewDimensionsFor(layout);
    div.style.width = divSize.width;
    div.style.height = divSize.height;
    previewMap.unwrap().updateSize();

    // Layer update if needed
    const previousLayers = previewMap.getLayers();
    const newLayers = mainMap.getLayers();
    const layersChanged = !_.isEqual(
      previousLayers.map((lay) => lay.getId()),
      newLayers.map((lay) => lay.getId())
    );
    if (layersChanged) {
      previewMap.unwrap().getLayers().clear();
      newLayers.forEach((lay) => {
        const clone = lay.shallowClone();
        previewMap.addLayer(clone);
      });
    }

    // View update
    const format = layout.format;
    const view = layout.view;
    const mapSize = previewMap.unwrap().getSize();
    if (!mapSize) {
      logger.error('Cannot update map: ', { mapSize });
      return;
    }

    const dimension = LayoutHelper.formatToPixel(format);
    const scaling = Math.min(dimension.width / mapSize[0], dimension.height / mapSize[1]);

    previewMap.unwrap().setView(
      new View({
        center: view.center,
        resolution: view.resolution * scaling,
        projection: view.projection.name,
      })
    );
  }

  private initializePreviewMap(div: HTMLDivElement): MapWrapper {
    logger.info('Initializing preview map');
    const preview = MapFactory.createLayout();
    preview.setTarget(div);

    // We listen for view changes, in order to persist them in layout
    preview.unwrap().on('moveend', this.handlePreviewChanged);

    getAbcWindow().abc.layoutPreview = new E2eMapWrapper(preview);

    this.setState({ previewMap: preview });
    return preview;
  }

  /**
   * Compute preview map dimensions from layout. The main goal of this function is to create
   * a map that fit both layout and user screen.
   */
  private getPreviewDimensionsFor(layout: AbcLayout): PreviewDimensions {
    const format = layout.format;
    const unit = 'vmin';
    const maxHeight = 80;
    const maxWidth = 100;

    // Portrait format
    if (format.height > format.width) {
      const height = Math.round(maxHeight);
      const width = Math.round((format.width * height) / format.height);
      return {
        width: `${width}${unit}`,
        height: `${height}${unit}`,
      };
    }
    // Landscape format
    else {
      const width = Math.round(maxWidth);
      const height = Math.round((format.height * width) / format.width);
      return {
        width: `${width}${unit}`,
        height: `${height}${unit}`,
      };
    }
  }

  /**
   * Notify parent component when preview map has been changed
   */
  private handlePreviewChanged = () => {
    const map = this.state.previewMap;
    const layout = this.props.layout;
    if (!map || !layout) {
      logger.error('Cannot handle preview changes: ', { map, layout });
      return;
    }

    const format = layout.format;
    const mapSize = map.unwrap().getSize();
    const view = map.unwrap().getView();
    const center = view.getCenter();
    const resolution = view.getResolution();
    const projection = view.getProjection();

    if (!mapSize || !center || !resolution) {
      logger.error('Cannot handle preview changes: ', { mapSize, center, resolution });
      return;
    }

    const dimension = LayoutHelper.formatToPixel(format);
    const scaling = Math.min(dimension.width / mapSize[0], dimension.height / mapSize[1]);

    const updated: AbcLayout = {
      ...layout,
      view: {
        center,
        projection: { name: projection.getCode() },
        resolution: Math.round(resolution / scaling), // We must round in order to prevent weird trigger
      },
    };

    if (!_.isEqual(layout, updated)) {
      this.props.onLayoutChanged(updated);
    }
  };
}

export default LayoutPreview;
