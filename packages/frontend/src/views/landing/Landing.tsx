import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import { Link } from 'react-router-dom';
import { FrontendRoutes } from '../../FrontendRoutes';
import './Landing.scss';

const logger = Logger.get('Landing.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const mapStateToProps = (state: RootState) => ({});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class Landing extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-landing'}>
        <h1>Bienvenue !</h1>
        <p>
          Abc-Map est un logiciel libre de cartographie.
          <br />
          Abc-Map vous permet de créer des cartes simplement, sans connaissances techniques.
        </p>
        <p>Pour créer votre première carte efficacement:</p>
        <p>
          <ul>
            <li>
              Prenez le temps de consulter <Link to={FrontendRoutes.Help}>la page Aide</Link>
            </li>
            <li>
              Commencez à créer sur la page <Link to={FrontendRoutes.Map}>la page Carte</Link>, importez des données à partir de votre navigateur ou{' '}
              <Link to={FrontendRoutes.DataStore}>sur la page Catalogue de données</Link>
            </li>
            <li>
              Mettez en page et exportez votre carte sur <Link to={FrontendRoutes.Layout}>la page Mise en page</Link>
            </li>
          </ul>
        </p>
        <p>
          Si vous souhaitez en savoir plus sur ce logiciel, <Link to={FrontendRoutes.About}>c&apos;est par ici.</Link>
        </p>
      </div>
    );
  }
}

export default connector(Landing);
