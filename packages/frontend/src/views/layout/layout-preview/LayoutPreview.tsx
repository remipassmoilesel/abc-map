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
import { AbcLegend, getAbcWindow, Logger } from '@abc-map/shared';
import { AbcLayout } from '@abc-map/shared';
import { LayoutHelper } from '../../../core/project/LayoutHelper';
import View from 'ol/View';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { PreviewDimensions } from './PreviewDimensions';
import * as _ from 'lodash';
import { E2eMapWrapper } from '../../../core/geo/map/E2eMapWrapper';
import Cls from './LayoutPreview.module.scss';
import { Control } from 'ol/control';
import { LegendRenderer } from '../../../core/project/rendering/LegendRenderer';
import { AttributionRenderer } from '../../../core/project/rendering/AttributionRenderer';

const logger = Logger.get('LayoutPreview.tsx');

interface Props {
  legend: AbcLegend;
  layout?: AbcLayout;
  mainMap: MapWrapper;
  onLayoutChanged: (lay: AbcLayout) => void;
  onNewLayout: () => void;
}

interface State {
  previewMap?: MapWrapper;
  legendCanvas?: HTMLCanvasElement;
  attributionsCanvas?: HTMLCanvasElement;
}

class LayoutPreview extends Component<Props, State> {
  private mapRef = React.createRef<HTMLDivElement>();
  private legendRenderer = new LegendRenderer();
  private attributionRenderer = new AttributionRenderer();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const layout = this.props.layout;
    const handleNewLayout = this.props.onNewLayout;

    return (
      <div className={Cls.layoutPreview} data-cy={'layout-preview'}>
        <h4>{layout?.name}</h4>
        {layout && (
          <div className={Cls.previewContainer}>
            <div className={Cls.previewMap} ref={this.mapRef} data-cy={'layout-preview-map'} />
          </div>
        )}
        {!layout && (
          <div className={Cls.noLayout}>
            <i className={`fa fa-print ${Cls.bigIcon}`} />
            <div>Créez une page pour exporter votre carte</div>
            <button onClick={handleNewLayout} className={'btn btn-primary mt-3'} data-cy={'new-layout'}>
              <i className={'fa fa-plus mr-2'} />
              Nouvelle page A4
            </button>
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.layout) {
      this.setupPreview(this.props.layout).catch((err) => logger.error('Rendering error: ', err));
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const layoutChanged = !_.isEqual(prevProps.layout?.id, this.props.layout?.id);
    const formatChanged = prevProps.layout?.format.name !== this.props.layout?.format.name;
    const legendChanged = prevProps.legend.display !== this.props.legend.display;
    if (layoutChanged || formatChanged || legendChanged) {
      this.setupPreview(this.props.layout).catch((err) => logger.error('Rendering error: ', err));
    }
  }

  public componentWillUnmount() {
    this.state.previewMap?.dispose();
  }

  private async setupPreview(layout?: AbcLayout): Promise<void> {
    // We dispose previous map
    this.state.previewMap?.dispose();
    if (!layout) {
      this.setState({ previewMap: undefined, legendCanvas: undefined, attributionsCanvas: undefined });
      return;
    }

    const mapSupport = this.mapRef.current;
    if (!mapSupport) {
      logger.error('Cannot update preview map: ', { mapSupport });
      return;
    }

    // Map initialization
    const mainMap = this.props.mainMap;
    const previewMap = this.initializePreviewMap(mapSupport);

    const divSize = this.getPreviewDimensionsFor(layout);
    mapSupport.style.width = divSize.width;
    mapSupport.style.height = divSize.height;
    previewMap.unwrap().updateSize();

    const mapSize = previewMap.unwrap().getSize();
    if (!mapSize) {
      logger.error('Cannot update preview map: ', { mapSize });
      return;
    }

    const dimension = LayoutHelper.formatToPixel(layout.format);
    const scaling = Math.min(dimension.width / mapSize[0], dimension.height / mapSize[1]);
    const styleRatio = LayoutHelper.styleRatio(mapSize[0], mapSize[1]);

    previewMap.unwrap().getLayers().clear();
    mainMap.getLayers().forEach((lay) => {
      const clone = lay.shallowClone(styleRatio);
      previewMap.addLayer(clone);
    });

    // Legend initialization
    const legend = this.props.legend;
    const canvas = this.initializeLegendCanvas(legend, previewMap);
    canvas.width = legend.width * styleRatio;
    canvas.height = legend.height * styleRatio;
    await this.legendRenderer.renderLegend(legend, canvas, styleRatio);

    // Attributions initialization
    const attributions = mainMap.getTextAttributions();
    const attrCanvas = this.initializeAttributionsCanvas(attributions, legend, previewMap);
    await this.attributionRenderer.render(attributions, attrCanvas, styleRatio);

    previewMap.unwrap().setView(
      new View({
        center: layout.view.center,
        resolution: layout.view.resolution * scaling,
        projection: layout.view.projection.name,
      })
    );
  }

  private initializePreviewMap(div: HTMLDivElement): MapWrapper {
    const previewMap = MapFactory.createLayoutPreview();
    previewMap.setTarget(div);

    // We listen for view changes, in order to persist them in layout
    previewMap.unwrap().on('moveend', this.handlePreviewChanged);

    getAbcWindow().abc.layoutPreview = new E2eMapWrapper(previewMap);

    this.setState({ previewMap });
    return previewMap;
  }

  private initializeLegendCanvas(legend: AbcLegend, previewMap: MapWrapper): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    this.legendRenderer.setPreviewStyle(legend, canvas);

    const control = new Control({ element: canvas });
    previewMap.unwrap().addControl(control);

    this.setState({ legendCanvas: canvas });
    return canvas;
  }

  private initializeAttributionsCanvas(attributions: string[], legend: AbcLegend, previewMap: MapWrapper): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    this.attributionRenderer.setPreviewStyle(attributions, legend, canvas);

    const control = new Control({ element: canvas });
    previewMap.unwrap().addControl(control);

    this.setState({ attributionsCanvas: canvas });
    return canvas;
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
}

export default LayoutPreview;
