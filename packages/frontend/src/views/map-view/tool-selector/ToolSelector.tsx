import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import { connect, ConnectedProps } from 'react-redux';
import { ToolRegistry } from '../../../core/geo/tools/ToolRegistry';
import { MapTool } from '@abc-map/shared-entities';
import { MainState } from '../../../core/store/reducer';
import './ToolSelector.scss';

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
    const buttons = ToolRegistry.getAll().map((tool) => {
      const classes = tool.getId() === this.props.currentTool ? 'btn btn-primary' : 'btn btn-outline-primary';
      return (
        <button
          key={tool.getId()}
          onClick={() => this.onToolSelected(tool.getId())}
          title={tool.getLabel()}
          className={classes}
          data-cy={`tool-${tool.getId().toLocaleLowerCase()}`}
        >
          {/*TODO: create and use icons*/}
          {tool.getIcon()}
        </button>
      );
    });
    return (
      <div className={'control-block abc-tool-selector'} data-cy={'tool-selector'}>
        <div>Outils de dessin</div>
        <div className={'tool-selector'}>{buttons}</div>
      </div>
    );
  }

  private onToolSelected(toolId: MapTool): void {
    const tool = ToolRegistry.getById(toolId);
    this.services.geo.setMainTool(tool);
  }
}

export default connector(ToolSelector);
