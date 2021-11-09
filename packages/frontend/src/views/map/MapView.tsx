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
import MainMap from './main-map/MainMap';
import LayerControls from './layer-controls/LayerControls';
import ProjectStatus from './project-status/ProjectStatus';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '@abc-map/shared';
import ProjectControls from './project-controls/ProjectControls';
import ToolSelector from './tool-selector/ToolSelector';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { MainState } from '../../core/store/reducer';
import { LayerWrapper } from '../../core/geo/layers/LayerWrapper';
import Search from './search/Search';
import ImportData from './import-data/ImportData';
import { ServiceProps, withServices } from '../../core/withServices';
import CursorPosition from './cursor-position/CursorPosition';
import { MapKeyboardListener } from './keyboard-listener/MapKeyboardListener';
import { MapEvent } from 'ol';
import { pageSetup } from '../../core/utils/page-setup';
import { MapActions } from '../../core/store/map/actions';
import { MapSizeChangedEvent } from '../../core/geo/map/MapWrapper.events';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../i18n/i18n';
import Cls from './MapView.module.scss';

const logger = Logger.get('MapView.tsx');

interface State {
  layers: LayerWrapper[];
  map: MapWrapper;
  keyboardListener?: MapKeyboardListener;
}

const mapStateToProps = (state: MainState) => ({
  mapDimensions: state.map.mainMapDimensions,
});

const mapDispatchToProps = {
  updateDimensions: MapActions.setMainMapDimensions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

const t = prefixedTranslation('MapView:');

class MapView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      layers: [],
      map: this.props.services.geo.getMainMap(),
    };
  }

  public render(): ReactNode {
    const activeLayer = this.state.layers.find((lay) => lay.isActive());
    const layers = this.state.layers;

    return (
      <div className={Cls.mapView}>
        {/*Left menu*/}
        <div className={Cls.leftPanel}>
          <Search />
          <CursorPosition />
          <ImportData />

          <div className={'flex-grow-1'} />

          <ProjectStatus />
          <ProjectControls />

          <div className={Cls.spacer} />
        </div>

        {/*Main map*/}
        <MainMap map={this.state.map} />

        {/*Right menu*/}
        <div className={Cls.rightPanel}>
          <HistoryControls historyKey={HistoryKey.Map} />
          <LayerControls layers={layers} />
          <ToolSelector activeLayer={activeLayer} />
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('The_map'), t('Visualize_and_create_in_your_browser'));

    const map = this.state.map;

    map.addSizeListener(this.handleMapSizeChange);
    map.addLayerChangeListener(this.handleLayerChange);
    this.handleLayerChange(); // We trigger manually the first event for setup

    map.unwrap().on('rendercomplete', this.handleRenderComplete);
    map.unwrap().on('error', this.handleMapError);

    const keyboardListener = MapKeyboardListener.create();
    keyboardListener.initialize();
    this.setState({ keyboardListener });
  }

  public componentWillUnmount() {
    const map = this.state.map;

    map.removeSizeListener(this.handleMapSizeChange);
    map.removeLayerChangeListener(this.handleLayerChange);
    map.unwrap().un('rendercomplete', this.handleRenderComplete);

    this.state.keyboardListener?.destroy();
  }

  private handleLayerChange = (): void => {
    logger.debug('Layers changed');
    const layers = this.state.map.getLayers();
    this.setState({ layers });
  };

  private handleRenderComplete = () => {
    logger.debug('Map rendering complete');
  };

  private handleMapError = (ev: MapEvent) => {
    const { toasts } = this.props.services;

    logger.error('Map error: ', ev);
    toasts.genericError();
  };

  /**
   * Here we set main map size in store for later exports.
   *
   * We keep only the biggest size in order to keep consistent exports event if window was resized.
   *
   * @param ev
   */
  private handleMapSizeChange = (ev: MapSizeChangedEvent) => {
    const width = ev.dimensions.width;
    const height = ev.dimensions.height;
    const previousWidth = this.props.mapDimensions?.width || 0;
    const previousHeight = this.props.mapDimensions?.height || 0;
    if (width > previousWidth || height > previousHeight) {
      this.props.updateDimensions(width, height);
    }
  };
}

export default withTranslation()(connector(withServices(MapView)));
