import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import './DataStore.scss';

const logger = Logger.get('DataStore.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const mapStateToProps = (state: RootState) => ({});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class DataStore extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-datastore'}>
        <h1>Catalogue de données</h1>
        <p>Sur cette page vous pouvez sélectionner et importer des données dans votre carte.</p>
        <p>Rappelez-vous: vous pouvez aussi importer des donnés en sélectionnant un fichier et en le déposant sur la carte !</p>
        <p>Cette page n&apos;est pas terminée !</p>
      </div>
    );
  }
}

export default connector(DataStore);
