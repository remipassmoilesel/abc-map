import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import { connect, ConnectedProps } from 'react-redux';
import { ToolRegistry } from '../../../core/geo/tools/registry/ToolRegistry';
import { MapTool } from '@abc-map/shared-entities';
import { MainState } from '../../../core/store/reducer';
import './ToolSelector.scss';
import SelectionPanel from './SelectionPanel';

// TODO: add help for tools

const logger = Logger.get('ToolSelector.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

const mapStateToProps = (state: MainState) => ({
  currentTool: state.map.tool,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

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
    if (this.props.currentTool === MapTool.Selection) {
      return <SelectionPanel />;
    }
  }

  private onToolSelected(toolId: MapTool): void {
    const tool = ToolRegistry.getById(toolId);
    this.services.geo.setMainTool(tool);
  }
}

export default connector(ToolSelector);
