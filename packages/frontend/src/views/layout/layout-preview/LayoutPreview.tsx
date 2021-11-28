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
import isEqual from 'lodash/isEqual';
import { LayoutHelper } from '../../../core/project/LayoutHelper';
import View from 'ol/View';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { PreviewDimensions } from './PreviewDimensions';
import { E2eMapWrapper } from '../../../core/geo/map/E2eMapWrapper';
import { Control } from 'ol/control';
import { LegendRenderer } from '../../../core/project/rendering/LegendRenderer';
import { AttributionRenderer } from '../../../core/project/rendering/AttributionRenderer';
import { toPrecision } from '../../../core/utils/numbers';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import Cls from './LayoutPreview.module.scss';

const logger = Logger.get('LayoutPreview.tsx');

interface Props {
  legend: AbcLegend;
  layout?: AbcLayout;
  mainMap: MapWrapper;
  onLayoutChanged: (lay: AbcLayout) => void;
  onNewLayout: () => void;
}

const t = prefixedTranslation('LayoutView:');

class LayoutPreview extends Component<Props, {}> {
  private mapRef = React.createRef<HTMLDivElement>();
  private legendRenderer = new LegendRenderer();
  private attributionRenderer = new AttributionRenderer();
  private previewMap?: MapWrapper;
  private legendCanvas?: HTMLCanvasElement;
  private attributionsCanvas?: HTMLCanvasElement;

  public render(): ReactNode {
    const layout = this.props.layout;
    const handleNewLayout = this.props.onNewLayout;

    return (
      <div className={Cls.layoutPreview} data-cy={'layout-preview'}>
        {/* There is one layout to preview, we display it */}
        {layout && (
          <>
            <h4>{layout?.name}</h4>
            <div className={Cls.previewContainer}>
              <div className={Cls.previewMap} ref={this.mapRef} data-cy={'layout-preview-map'} />
            </div>
          </>
        )}

        {/* There is no layout to preview, we display a message with "create" a button */}
        {!layout && (
          <div className={Cls.noLayout}>
            <FaIcon icon={IconDefs.faPrint} size={'5rem'} className={'mb-3'} />
            <div className={'mb-3'}>{t('Create_layout_to_export')}</div>

            <button onClick={handleNewLayout} className={'btn btn-primary mt-3'} data-cy={'new-layout'}>
              <FaIcon icon={IconDefs.faPlus} className={'mr-2'} />
              {t('Create_A4_layout')}
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
    // If layout, format or legend change we setup whole preview map
    // This is a visible operation, map will blink during setup even if it was previously set up
    const layoutChanged = !isEqual(prevProps.layout?.id, this.props.layout?.id);
    const formatChanged = prevProps.layout?.format.id !== this.props.layout?.format.id;
    const legendChanged = prevProps.legend.display !== this.props.legend.display;
    if (layoutChanged || formatChanged || legendChanged) {
      this.setupPreview(this.props.layout).catch((err) => logger.error('Rendering error: ', err));
    }

    // If layout view change, we change the preview map view
    // This occurs when user switch active layout or when undo button is pressed
    const viewChanged = !isEqual(prevProps.layout?.view, this.props.layout?.view);
    if (this.props.layout && viewChanged) {
      this.setPreviewView(this.props.layout);
    }
  }

  public componentWillUnmount() {
    this.previewMap?.dispose();
  }

  /**
   * This method setup map preview, legend and attributions preview
   * @param layout
   * @private
   */
  private async setupPreview(layout?: AbcLayout): Promise<void> {
    // We dispose previous map
    this.previewMap?.dispose();
    if (!layout) {
      this.previewMap = undefined;
      this.legendCanvas = undefined;
      this.attributionsCanvas = undefined;
      return;
    }

    const mapSupport = this.mapRef.current;
    if (!mapSupport) {
      logger.error('Cannot update preview map: ', { mapSupport });
      return;
    }

    // Map initialization
    // We compute size of map, then we clone layers from main map, with the preview style ratio
    const previewMap = this.initializePreviewMap(mapSupport);
    this.previewMap = previewMap;

    const divSize = this.getPreviewDimensionsFor(layout);
    mapSupport.style.width = divSize.width;
    mapSupport.style.height = divSize.height;
    previewMap.unwrap().updateSize();

    const mapSize = previewMap.unwrap().getSize();
    if (!mapSize) {
      logger.error('Cannot update preview map, no size defined');
      return;
    }

    const styleRatio = LayoutHelper.styleRatio(mapSize[0], mapSize[1]);

    this.previewMap.unwrap().getLayers().clear();
    this.props.mainMap.getLayers().forEach((lay) => {
      const clone = lay.shallowClone(styleRatio);
      previewMap.addLayer(clone);
    });

    // Legend initialization
    const legend = this.props.legend;
    this.legendCanvas = this.initializeLegendCanvas(legend, previewMap);
    this.legendCanvas.width = legend.width * styleRatio;
    this.legendCanvas.height = legend.height * styleRatio;
    await this.legendRenderer.renderLegend(legend, this.legendCanvas, styleRatio);

    // Attributions initialization
    const attributions = this.props.mainMap.getTextAttributions();
    this.attributionsCanvas = this.initializeAttributionsCanvas(attributions, legend, previewMap);
    await this.attributionRenderer.render(attributions, this.attributionsCanvas, styleRatio);

    this.setPreviewView(layout);
  }

  /**
   * This method only set view of map
   * @param layout
   * @private
   */
  private setPreviewView(layout: AbcLayout) {
    if (!this.previewMap) {
      return;
    }

    const mapSize = this.previewMap.unwrap().getSize();
    if (!mapSize) {
      logger.error('Cannot update preview map view, no size defined');
      return;
    }

    const dimension = LayoutHelper.formatToPixel(layout.format);
    const scaling = Math.min(dimension.width / mapSize[0], dimension.height / mapSize[1]);

    this.previewMap.unwrap().setView(
      new View({
        center: layout.view.center,
        resolution: toPrecision(layout.view.resolution * scaling, 10),
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

    return previewMap;
  }

  private initializeLegendCanvas(legend: AbcLegend, previewMap: MapWrapper): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    this.legendRenderer.setPreviewStyle(legend, canvas);

    const control = new Control({ element: canvas });
    previewMap.unwrap().addControl(control);

    return canvas;
  }

  private initializeAttributionsCanvas(attributions: string[], legend: AbcLegend, previewMap: MapWrapper): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    this.attributionRenderer.setPreviewStyle(attributions, legend, canvas);

    const control = new Control({ element: canvas });
    previewMap.unwrap().addControl(control);

    return canvas;
  }

  /**
   * Notify parent component when preview map has been changed, per example if user drag map
   */
  private handlePreviewChanged = () => {
    const map = this.previewMap;
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
        resolution: toPrecision(resolution / scaling, 10),
      },
    };

    if (!isEqual(layout, updated)) {
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

export default withTranslation()(LayoutPreview);
