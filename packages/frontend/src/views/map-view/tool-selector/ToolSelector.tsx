import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import { connect, ConnectedProps } from 'react-redux';
import { ToolRegistry } from '../../../core/geo/tools/registry/ToolRegistry';
import { MapTool } from '@abc-map/shared-entities';
import { MainState } from '../../../core/store/reducer';
import SelectionPanel from './selection/SelectionPanel';
import CirclePanel from './circle/CirclePanel';
import LineStringPanel from './line-string/LineStringPanel';
import PointPanel from './point/PointPanel';
import PolygonPanel from './polygon/PolygonPanel';
import './ToolSelector.scss';

const logger = Logger.get('ToolSelector.tsx', 'info');

const mapStateToProps = (state: MainState) => ({
  currentTool: state.map.tool,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class ToolSelector extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const buttons = this.getToolButtons();
    const toolPanel = this.getToolPanel();

    return (
      <div className={'control-block abc-tool-selector'} data-cy={'tool-selector'}>
        <div className={'mb-2 text-bold'}>Outils de dessin</div>
        <div className={'tool-list'}>{buttons}</div>
        {toolPanel && <div className={'tool-panel'}>{toolPanel}</div>}
      </div>
    );
  }

  private getToolButtons(): ReactNode[] {
    return ToolRegistry.getAll().map((tool) => {
      const isActive = tool.getId() === this.props.currentTool;
      const classes = isActive ? 'tool-button active' : 'tool-button';
      return (
        <button
          key={tool.getId()}
          onClick={() => this.onToolSelected(tool.getId())}
          title={tool.getLabel()}
          className={classes}
          data-cy={`tool-${tool.getId().toLocaleLowerCase()}`}
        >
          <img src={tool.getIcon()} alt={tool.getLabel()} title={tool.getLabel()} />
        </button>
      );
    });
  }

  private getToolPanel(): ReactNode | undefined {
    if (MapTool.Selection === this.props.currentTool) {
      return <SelectionPanel />;
    } else if (MapTool.Circle === this.props.currentTool) {
      return <CirclePanel />;
    } else if (MapTool.LineString === this.props.currentTool) {
      return <LineStringPanel />;
    } else if (MapTool.Point === this.props.currentTool) {
      return <PointPanel />;
    } else if (MapTool.Polygon === this.props.currentTool) {
      return <PolygonPanel />;
    }
  }

  private onToolSelected(toolId: MapTool): void {
    const tool = ToolRegistry.getById(toolId);
    this.services.geo.setMainTool(tool);
  }
}

export default connector(ToolSelector);
