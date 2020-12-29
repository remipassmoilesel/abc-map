import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import { Link } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/shared-entities';
import './NotFound.scss';

const logger = Logger.get('NotFound.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const mapStateToProps = (state: RootState) => ({});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class NotFound extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-not-found'}>
        <h3>Cette page n&apos;existe pas !</h3>
        <Link to={FrontendRoutes.landing()}>Retourner à l&apos;accueil</Link>
      </div>
    );
  }
}

export default connector(NotFound);
