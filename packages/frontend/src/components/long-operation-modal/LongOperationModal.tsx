/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component, ReactNode } from 'react';
import { ModalEvent, ModalEventType } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { Logger } from '@abc-map/shared';
import Cls from './LongOperationModal.module.scss';

interface State {
  visible: boolean;
  burning: boolean;
}

const logger = Logger.get('LongOperationModal.ts');

/**
 * This modal is a little hack, one among many others.
 *
 * As we does not use web workers yet, display may freeze. So we display a static waiting screen to hide it 🪄
 *
 */
class LongOperationModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = { visible: false, burning: false };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const burning = this.state.burning;
    if (!visible) {
      return <div />;
    }

    return (
      <div className={Cls.modal}>
        {burning && (
          <>
            <h1>Ça chauffe !</h1>
            <div className={Cls.icon}>🔥</div>
            <div>N&apos;essayez pas de vous enfuir, c&apos;est peine perdue ...</div>
          </>
        )}
        {!burning && (
          <>
            <h1>Ha quand même !</h1>
            <div className={Cls.icon} data-cy={'long-operation-done'}>
              ✅
            </div>
          </>
        )}
      </div>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    modals.addListener(ModalEventType.ShowLongOperationModal, this.handleVisibilityChanged);
    modals.addListener(ModalEventType.LongOperationModalClosed, this.handleVisibilityChanged);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowLongOperationModal, this.handleVisibilityChanged);
    modals.removeListener(ModalEventType.LongOperationModalClosed, this.handleVisibilityChanged);
  }

  private handleVisibilityChanged = (ev: ModalEvent) => {
    if (ModalEventType.ShowLongOperationModal === ev.type) {
      this.setState({ visible: true, burning: ev.burning });
    } else if (ModalEventType.LongOperationModalClosed === ev.type) {
      this.setState({ visible: false, burning: false });
    } else {
      logger.error('Unhandled event: ', ev);
    }
  };
}

export default withServices(LongOperationModal);
