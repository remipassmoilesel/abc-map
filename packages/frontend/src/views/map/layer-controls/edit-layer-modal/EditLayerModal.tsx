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

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';
import { LayerWrapper } from '../../../../core/geo/layers/LayerWrapper';
import { Logger } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../../../core/withServices';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { EditLayerChangeset } from '../../../../core/history/changesets/layers/EditLayerChangeset';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './EditLayerModal.module.scss';

const logger = Logger.get('EditLayerModal.tsx');

interface Props extends ServiceProps {
  layer: LayerWrapper;
  onHide: () => void;
}

interface State {
  nameInput: string;
  opacityInput: number;
  attributionsInput: string;
}

const t = prefixedTranslation('MapView:EditLayerModal.');

class EditLayerModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nameInput: '',
      opacityInput: 1,
      attributionsInput: '',
    };
  }

  public render(): ReactNode {
    const onHide = this.props.onHide;
    const layer = this.props.layer;
    const nameInput = this.state.nameInput;
    const opacityInput = this.state.opacityInput;
    const attributionsInput = this.state.attributionsInput;

    return (
      <Modal show={true} onHide={onHide} size={'lg'} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {t('Edit_layer')} {layer.getName()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`p-3`}>
            {/* Name of layer */}
            <div className={'mb-2'}>{t('Name_of_layer')}:</div>
            <input
              type={'text'}
              value={nameInput}
              onChange={this.handleNameChange}
              className={'form-control mb-4'}
              data-testid={'name-input'}
              data-cy={'name-input'}
            />

            {/* Opacity */}
            <div className={'mb-2'}>{t('Opacity')}:</div>
            <div className={'d-flex align-items-center mb-4'}>
              <input
                type="range"
                value={opacityInput}
                onChange={this.handleOpacityChange}
                min="0"
                max="1"
                step={'0.1'}
                className={Cls.opacitySlider}
                data-testid={'opacity-input'}
              />
              <div className={'ml-2'}>{opacityInput} / 1</div>
            </div>

            {/* Additional attributions */}
            <div className={'my-2'}>Attributions:</div>
            <textarea
              value={attributionsInput}
              onChange={this.handleAttributionsChange}
              rows={3}
              className={'form-control mb-4'}
              data-testid={'attributions-input'}
            />

            <div className={'d-flex justify-content-end'}>
              <button className={'btn btn-secondary mr-3'} onClick={onHide} data-testid={'cancel-button'}>
                {t('Cancel')}
              </button>
              <button onClick={this.handleConfirm} className={'btn btn-primary'} data-testid={'submit-button'} data-cy={'submit-button'}>
                {t('Confirm')}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    this.updateState();
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.layer.getId() !== this.props.layer.getId()) {
      this.updateState();
    }
  }

  private updateState() {
    const layer = this.props.layer;
    this.setState({
      nameInput: layer.getName() || '',
      opacityInput: layer.getOpacity(),
      attributionsInput: layer.getAttributions()?.join('\r\n') || '',
    });
  }

  private handleNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: ev.target.value });
  };

  private handleOpacityChange = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ opacityInput: parseFloat(ev.target.value) });
  };

  private handleAttributionsChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ attributionsInput: ev.target.value });
  };

  private handleConfirm = () => {
    const { history, geo } = this.props.services;
    const map = geo.getMainMap();
    const layer = this.props.layer;
    const name = this.state.nameInput;
    const opacity = this.state.opacityInput;
    const attributions = this.state.attributionsInput.split(/\r?\n/);

    const change = async () => {
      const before = { name: layer.getName() || '', opacity: layer.getOpacity(), attributions: layer.getAttributions()?.slice() || [] };
      const after = { name, opacity, attributions };
      if (!isEqual(before, after)) {
        const cs = new EditLayerChangeset(map, layer, before, after);
        await cs.apply();
        history.register(HistoryKey.Map, cs);
      }

      this.props.onHide();
    };

    change().catch((err) => logger.error('Cannot update layer', err));
  };
}

export default withTranslation()(withServices(EditLayerModal));
