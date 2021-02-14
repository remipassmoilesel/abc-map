import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../../../core/utils/Logger';
import { Colors } from './colors';
import './ColorPickerButton.scss';

const logger = Logger.get('ColorPickerButton.tsx', 'info');

interface Props {
  label: string;
  initialValue?: string;
  onChange: (value: string) => void;
  'data-cy'?: string;
}

interface State {
  popupVisible: boolean;
  value: string;
}

class ColorPickerButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      popupVisible: false,
      value: this.props.initialValue || '#fffff',
    };
  }

  public render(): ReactNode {
    return (
      <div className={'abc-color-picker-button'} data-cy={this.props['data-cy']}>
        <button onClick={this.onClick} className={'picker-button'} type={'button'} style={{ backgroundColor: this.state.value }} />
        {this.props.label}
        {this.state.popupVisible && (
          <>
            <div className={'picker-backdrop'} onClick={this.onClose} data-cy={'color-picker-backdrop'} />
            <div className={'picker-popover'}>
              <div className={'color-buttons'}>
                {Colors.map((color) => (
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
