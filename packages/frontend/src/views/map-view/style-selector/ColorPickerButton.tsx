import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../core/utils/Logger';
import './ColorPickerButton.scss';

// TODO: try again react-color ? Last version was buggy

const logger = Logger.get('ColorPickerButton.tsx', 'info');

interface Props {
  label: string;
  initialValue?: string;
  onChange: (value: string) => void;
}

interface State {
  popupVisible: boolean;
  value: string;
}

const colors = [
  '#ffffff',
  '#000000',
  '#696969',
  '#bada55',
  '#05ff00',
  '#ffd700',
  '#7fe5f0',
  '#ff0000',
  '#ff80ed',
  '#407294',
  '#cbcba9',
  '#420420',
  '#065535',
  '#c0c0c0',
  '#5ac18e',
  '#666666',
  '#576675',
  '#ffc0cb',
  '#ffe4e1',
  '#696966',
  '#008080',
  '#e6e6fa',
  '#ffa500',
];

class ColorPickerButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    logger.info('', this.props.initialValue);
    this.state = {
      popupVisible: false,
      value: this.props.initialValue || '#fffff',
    };
  }

  public render(): ReactNode {
    return (
      <div className={'abc-color-picker-button'}>
        <button onClick={this.onClick} className={'picker-button'} type={'button'} style={{ backgroundColor: this.state.value }} />
        {this.props.label}
        {this.state.popupVisible && (
          <>
            <div className={'picker-backdrop'} onClick={this.onClose} />
            <div className={'picker-popover'}>
              <div className={'color-buttons'}>
                {colors.map((color) => (
                  <button key={color} onClick={() => this.onChange(color)} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  private onClick = () => {
    this.setState((st) => ({ popupVisible: !st.popupVisible }));
  };

  private onChange = (ev: string) => {
    this.setState({ value: ev });
    this.props.onChange(ev);
  };

  private onClose = () => {
    this.setState({ popupVisible: false });
  };
}

export default ColorPickerButton;
