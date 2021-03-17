import React, { Component, ReactNode } from 'react';
import Cls from './MessageBanner.module.scss';

enum MessageState {
  Hidden = 'Hidden',
  Visible = 'Visible',
  Hiding = 'Hiding',
  Dismissed = 'Dismissed',
}

interface State {
  message: string;
  state: MessageState;
  interval?: any;
}

class MessageBanner extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      state: MessageState.Hidden,
      message: '',
    };
  }

  public render(): ReactNode {
    const message = this.state.message;
    if (!message) {
      return <div />;
    }

    return (
      <div className={Cls.messageBanner}>
        <div>{message}</div>
        <button className={'btn btn-link'} onClick={this.dismiss}>
          <i className={'fa fa-times'} />
        </button>
      </div>
    );
  }

  public componentDidMount() {
    const interval = setInterval(() => {
      const state = this.state.state;
      if (MessageState.Hidden === state) {
        const message = "Coucou, c'est moi la bannière qui demande des sous ! Admirez comme je suis discrète, cliquez pour voir";
        this.setState({ message, state: MessageState.Visible });
      }
      if (MessageState.Visible === state) {
        const message = 'Bon, je repasserai alors ...';
        this.setState({ message, state: MessageState.Hiding });
      }
      if (MessageState.Hiding === state) {
        this.setState({ message: '', state: MessageState.Dismissed });
      }
    }, 20_000);

    this.setState({ interval });
  }

  public componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  public dismiss = () => {
    this.setState({ message: '', state: MessageState.Dismissed });
    clearInterval(this.state.interval);
  };
}

export default MessageBanner;
