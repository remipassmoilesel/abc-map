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
import { Logger } from '@abc-map/shared';
import { HistoryKey } from '../../core/history/HistoryKey';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../core/store/reducer';
import { ServiceProps, withServices } from '../../core/withServices';

const logger = Logger.get('HistoryControls.tsx');

interface LocalProps {
  historyKey: HistoryKey;
}

const mapStateToProps = (state: MainState) => ({
  capabilities: state.ui.historyCapabilities,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & LocalProps & ServiceProps;

class HistoryControls extends Component<Props, {}> {
  public render(): ReactNode {
    const canUndo = this.canUndo();
    const canRedo = this.canRedo();
    return (
      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={this.onCancel} type={'button'} className={'btn btn-link'} disabled={!canUndo} data-cy={'undo'}>
            <i className={'fa fa-undo mr-2'} /> Annuler
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.onRedo} type={'button'} className={'btn btn-link'} disabled={!canRedo} data-cy={'redo'}>
            <i className={'fa fa-redo mr-2'} /> Refaire
          </button>
        </div>
      </div>
    );
  }

  private onCancel = () => {
    const { history, toasts } = this.props.services;

    history.undo(this.props.historyKey).catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  };

  private onRedo = () => {
    const { history, toasts } = this.props.services;

    history.redo(this.props.historyKey).catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  };

  private canUndo = (): boolean => {
    const capabilities = this.props.capabilities[this.props.historyKey];
    if (!capabilities) {
      return false;
    }
    return capabilities.canUndo;
  };

  private canRedo = (): boolean => {
    const capabilities = this.props.capabilities[this.props.historyKey];
    if (!capabilities) {
      return false;
    }
    return capabilities.canRedo;
  };
}

export default connector(withServices(HistoryControls));
