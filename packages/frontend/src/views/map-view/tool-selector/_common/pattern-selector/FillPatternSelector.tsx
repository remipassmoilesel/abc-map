import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '../../../../../core/utils/Logger';
import { FillPatterns } from '@abc-map/shared-entities';
import { LabelledFillPatterns } from './LabelledFillPatterns';
import { FillPatternFactory } from '../../../../../core/geo/style/FillPatternFactory';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { connect, ConnectedProps } from 'react-redux';
import { services } from '../../../../../core/Services';
import { UpdateStyleItem, UpdateStyleTask } from '../../../../../core/history/tasks/UpdateStyleTask';
import { VectorStyles } from '../../../../../core/geo/style/VectorStyles';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import './FillPatternSelector.scss';

const logger = Logger.get('FillPatternSelector.tsx', 'info');

const mapStateToProps = (state: MainState) => ({
  fill: state.map.currentStyle.fill,
});

const mapDispatchToProps = {
  setPattern: MapActions.setFillPattern,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class FillPatternSelector extends Component<Props, {}> {
  private services = services();
  private canvas = React.createRef<HTMLCanvasElement>();

  public render(): ReactNode {
    const options = this.getOptions();
    return (
      <div className={'abc-fill-pattern-selector'}>
        <div className={'d-flex align-items-start justify-content-between'}>
          <div className={'mb-2'}>Texture:</div>
          <canvas ref={this.canvas} width={80} height={50} />
        </div>
        <select onChange={this.handleSelectChange} value={this.props.fill.pattern}>
          {options}
        </select>
      </div>
    );
  }

  public componentDidMount() {
    this.preview();
  }

  public componentDidUpdate() {
    this.preview();
  }

  private handleSelectChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const pattern = ev.target.value as FillPatterns;
    this.props.setPattern(pattern);

    const historyItems: UpdateStyleItem[] = [];
    this.services.geo.getMainMap().forEachFeatureSelected((feat) => {
      const newStyle = VectorStyles.getProperties(feat);
      newStyle.fill.pattern = pattern;

      historyItems.push({
        feature: feat,
        before: VectorStyles.getProperties(feat),
        after: newStyle,
      });

      VectorStyles.setProperties(feat, newStyle);
    });

    if (historyItems.length) {
      this.services.history.register(HistoryKey.Map, new UpdateStyleTask(historyItems));
    }
  };

  private getOptions() {
    return LabelledFillPatterns.All.map((item) => {
      return (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      );
    });
  }

  private preview() {
    const pattern = this.props.fill.pattern;
    const color1 = this.props.fill.color1;
    const color2 = this.props.fill.color2;
    const canvas = this.canvas.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      logger.error('Canvas not ready');
      return;
    }

    if (FillPatterns.Flat === pattern) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const canvasPattern = FillPatternFactory.create({
      pattern,
      color1,
      color2,
    });

    if (!canvasPattern) {
      logger.error(`Invalid pattern: ${pattern}`);
      return;
    }

    ctx.fillStyle = canvasPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

export default connector(FillPatternSelector);
