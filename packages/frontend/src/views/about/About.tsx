import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import './About.scss';

const logger = Logger.get('Help.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const mapStateToProps = (state: RootState) => ({});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class About extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-about'}>
        <h1>A propos d&apos;Abc-Map</h1>
        <p>Sur cette page vous en apprendrez plus sur ce projet, sur son développement et sur les outils utilisés pour créer ce logiciel.</p>
        <p>Cette page n&apos;est pas terminée !</p>
      </div>
    );
  }
}

export default connector(About);
