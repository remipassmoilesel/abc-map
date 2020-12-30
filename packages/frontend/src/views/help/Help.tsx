import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { MainState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import './Help.scss';

const logger = Logger.get('Help.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const mapStateToProps = (state: MainState) => ({});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class Help extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-help'}>
        <h1>Aide</h1>
        <p>Sur cette page, vous trouverez des tutoriels et le manuel d&apos;Abc-Map.</p>
        <p>Cette page n&apos;est pas terminée !</p>
      </div>
    );
  }
}

export default connector(Help);
