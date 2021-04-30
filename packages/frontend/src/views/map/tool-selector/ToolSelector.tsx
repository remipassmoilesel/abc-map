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
import { Logger } from '@abc-map/frontend-commons';
import { connect, ConnectedProps } from 'react-redux';
import { ToolRegistry } from '../../../core/geo/tools/ToolRegistry';
import { MapTool } from '@abc-map/frontend-commons';
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
import Cls from './ToolSelector.module.scss';
import EditPropertiesToolPanel from './edit-properties/EditPropertiesToolPanel';

const logger = Logger.get('ToolSelector.tsx', 'info');

interface LocalProps {
  activeLayer?: LayerWrapper;
}

const mapStateToProps = (state: MainState) => ({
  currentTool: state.map.tool,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & LocalProps & ServiceProps;

class ToolSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const toolsActive = (this.props.activeLayer && this.props.activeLayer.isVector()) || false;
    const buttons = toolsActive && this.getToolButtons();
    const toolPanel = toolsActive && this.getToolPanel();

    return (
      <div className={`control-block ${Cls.toolSelector}`} data-cy={'tool-selector'}>
        <div className={'mb-2 text-bold'}>Outils de dessin</div>
        {toolsActive && (
          <>
            <div className={Cls.toolList}>{buttons}</div>
            {toolPanel && <div className={Cls.toolPanel}>{toolPanel}</div>}
          </>
        )}
        {!toolsActive && (
          <div className={Cls.message}>
            Vous devez sélectionner une couche de géométries pour utiliser les outils.
            <button onClick={this.createVectorLayer} className={'btn btn-outline-secondary my-3'}>
              Créer une couche
            </button>
          </div>
        )}
      </div>
    );
  }

  private getToolButtons(): ReactNode[] {
    return ToolRegistry.getAll().map((tool) => {
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

export default connector(withServices(ToolSelector));
