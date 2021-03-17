import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { connect, ConnectedProps } from 'react-redux';
import { ToolRegistry } from '../../../core/geo/tools/ToolRegistry';
import { MapTool } from '@abc-map/frontend-shared';
import { MainState } from '../../../core/store/reducer';
import SelectionPanel from './selection/SelectionPanel';
import CirclePanel from './circle/CirclePanel';
import LineStringPanel from './line-string/LineStringPanel';
import PointPanel from './point/PointPanel';
import PolygonPanel from './polygon/PolygonPanel';
import TextPanel from './text/TextPanel';
import RectanglePanel from './rectangle/RectanglePanel';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../core/history/tasks/layers/AddLayersTask';
import { ServiceProps, withServices } from '../../../core/withServices';
import Cls from './ToolSelector.module.scss';

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
            Vous devez sélectionner une couche de formes pour utiliser les outils.
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
    } else if (MapTool.Circle === this.props.currentTool) {
      return <CirclePanel />;
    } else if (MapTool.Rectangle === this.props.currentTool) {
      return <RectanglePanel />;
    } else if (MapTool.Text === this.props.currentTool) {
      return <TextPanel />;
    } else if (MapTool.Selection === this.props.currentTool) {
      return <SelectionPanel />;
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
