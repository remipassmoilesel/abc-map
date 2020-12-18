import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { ConfirmAccountParams, FrontendRoutes } from '../../FrontendRoutes';
import { AccountConfirmationStatus } from '@abc-map/shared-entities';
import * as qs from 'query-string';
import './ConfirmAccount.scss';

const logger = Logger.get('ConfirmAccount.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  status: AccountConfirmationStatus;
}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const mapStateToProps = (state: RootState) => ({});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps & RouteComponentProps<ConfirmAccountParams>;

class ConfirmAccount extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      status: AccountConfirmationStatus.InProgress,
    };
  }

  public render(): ReactNode {
    return (
      <div className={'abc-confirm-account'}>
        <h3>Activation de votre compte</h3>
        <div className={'message'}>
          {AccountConfirmationStatus.InProgress === this.state.status && <div>Veuillez patienter ...</div>}
          {AccountConfirmationStatus.UserNotFound === this.state.status && <div>Une erreur est survenue, essayez de vous inscrire à nouveau.</div>}
          {AccountConfirmationStatus.Failed === this.state.status && (
            <div>La confirmation a échoué, vous pouvez rafraichir cette page ou réessayer plus tard.</div>
          )}
          {AccountConfirmationStatus.Succeed === this.state.status && (
            <div>
              Votre compte est activé. <Link to={FrontendRoutes.map()}>Direction: la carte !</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const userId = this.props.match.params.userId;
    const secret = qs.parse(this.props.location.search).secret as string;
    if (!userId || !secret) {
      this.setState({ status: AccountConfirmationStatus.Failed });
    } else {
      this.services.authentication
        .confirmAccount(userId, secret)
        .then((res) => {
          if (res.error) {
            return Promise.reject(new Error(res.error));
          }
          this.setState({ status: res.status });
        })
        .catch((err) => {
          logger.error(err);
          this.setState({ status: AccountConfirmationStatus.Failed });
        });
    }
  }
}

export default withRouter(connector(ConfirmAccount));
