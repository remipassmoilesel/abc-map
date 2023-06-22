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

import Cls from './DownloadExplanation.module.scss';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import React from 'react';
import MainIcon from '../../../assets/main-icon.svg';

interface Props {
  onClose: () => void;
}

export function DownloadExplanation(props: Props) {
  const { onClose } = props;
  const { t } = useTranslation('SharedMapView');
  const mainAppAddress = `${window.location.protocol}//${window.location.host}`;

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Map_data')} 🌍</Modal.Title>
      </Modal.Header>
      <Modal.Body className={'d-flex flex-column p-3'}>
        <div className={'d-flex align-items-center'}>
          <div className={'d-flex flex-column align-items-center mr-3'}>
            <img src={MainIcon} className={Cls.icon} alt={'Abc-Map'} />
            <div>Abc-Map</div>
          </div>

          <div className={'ml-4'}>
            <h4 className={'mb-4'}>
              <i>Et voila !</i>
            </h4>
            <div className={'mb-3'}>{t('Beautiful_data_ready_to_use')} 🚀</div>
            <div>
              {t('See_you_on')}&nbsp;
              <a href={mainAppAddress} target={'_blank'} rel="noreferrer">
                {document.location.host}
              </a>
            </div>
          </div>
        </div>

        <div className={'d-flex justify-content-end'}>
          <a href={mainAppAddress} className={'btn btn-primary'} onClick={onClose} target={'_blank'} rel="noreferrer">
            {t('Lets_go')}
          </a>
        </div>
      </Modal.Body>
    </Modal>
  );
}
