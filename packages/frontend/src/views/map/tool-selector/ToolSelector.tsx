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
import { connect, ConnectedProps } from 'react-redux';
import { ToolRegistry } from '../../../core/tools/ToolRegistry';
import { MapTool } from '@abc-map/shared';
import { MainState } from '../../../core/store/reducer';
import SelectionPanel from './selection/SelectionToolPanel';
import LineStringPanel from './line-string/LineStringToolPanel';
import PointPanel from './point/PointToolPanel';
import PolygonPanel from './polygon/PolygonToolPanel';
import TextToolPanel from './text/TextToolPanel';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../core/history/tasks/layers/AddLayersTask';
import { ServiceProps, withServices } from '../../../core/withServices';
import EditPropertiesToolPanel from './edit-properties/EditPropertiesToolPanel';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './ToolSelector.module.scss';

interface LocalProps {
  activeLayer?: LayerWrapper;
}

const mapStateToProps = (state: MainState) => ({
  currentTool: state.map.tool,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & LocalProps & ServiceProps;

const t = prefixedTranslation('MapView:ToolSelector.');

class ToolSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const activeLayer = this.props.activeLayer;
    const toolsActive = (activeLayer && activeLayer.isVector()) || false;
    const buttons = toolsActive && this.getToolButtons();
    const toolPanel = toolsActive && this.getToolPanel();

    return (
      <div className={`control-block ${Cls.toolSelector}`} data-cy={'tool-selector'}>
        <div className={'mb-2 text-bold'}>{t('Drawing_tools')}</div>
        {toolsActive && buttons && (
          <>
            {buttons.map((row, i) => (
              <div key={i} className={Cls.toolRow}>
                {row}
              </div>
            ))}

            {toolPanel && <div className={Cls.toolPanel}>{toolPanel}</div>}
          </>
        )}
        {!toolsActive && (
          <div className={Cls.message}>
            {t('You_must_select_geometry_layer_before')}
            <button onClick={this.createVectorLayer} className={'btn btn-outline-secondary my-3'}>
              <i className={'fa fa-plus mr-2'} />
              {t('Create_geometry_layer')}
            </button>
          </div>
        )}
      </div>
    );
  }

  private getToolButtons(): ReactNode[][] {
    const flatList = ToolRegistry.getAll().map((tool) => {
      const isActive = tool.getId() === this.props.currentTool;
      const classes = isActive ? `${Cls.toolButton} ${Cls.active}` : Cls.toolButton;
      return (
        <button
          key={tool.getId()}
          onClick={() => this.handleSelection(tool.getId())}
          title={tool.getLabel()}
          className={classes}
          data-cy={`tool-${tool.getId().toLocaleLowerCase()}`}
          data-active={isActive}
        >
          <img src={tool.getIcon()} alt={tool.getLabel()} title={tool.getLabel()} />
        </button>
      );
    });

    const rowLength = 4;
    const rows: ReactNode[][] = [];
    for (let i = 0; i < flatList.length; i += rowLength) {
      rows.push(flatList.slice(i, i + rowLength));
    }

    return rows;
  }

  private getToolPanel(): ReactNode | undefined {
    if (MapTool.Point === this.props.currentTool) {
      return <PointPanel />;
    } else if (MapTool.LineString === this.props.currentTool) {
      return <LineStringPanel />;
    } else if (MapTool.Polygon === this.props.currentTool) {
      return <PolygonPanel />;
    } else if (MapTool.Text === this.props.currentTool) {
      return <TextToolPanel />;
    } else if (MapTool.Selection === this.props.currentTool) {
      return <SelectionPanel />;
    } else if (MapTool.EditProperties === this.props.currentTool) {
      return <EditPropertiesToolPanel />;
    }
  }

  private handleSelection(toolId: MapTool): void {
    const { geo } = this.props.services;

    const tool = ToolRegistry.getById(toolId);
    geo.setMainTool(tool);
  }

  private createVectorLayer = () => {
    const { geo, history } = this.props.services;

    const map = geo.getMainMap();
    const layer = LayerFactory.newVectorLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);

    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };
}

export default withTranslation()(connector(withServices(ToolSelector)));
