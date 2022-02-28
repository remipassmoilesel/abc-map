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

import { withTranslation } from 'react-i18next';
import { AbcArtefact, getTextByLang, Logger } from '@abc-map/shared';
import { useServices } from '../../../core/useServices';
import { Modal } from 'react-bootstrap';
import Cls from './LicenseModal.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { getLang, prefixedTranslation } from '../../../i18n/i18n';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { linkify } from '../../../core/utils/strings';

const logger = Logger.get('LicenseModal.tsx');

const t = prefixedTranslation('DataStoreView:');

interface Props {
  artefact: AbcArtefact;
  onClose: () => void;
}

function LicenseModal(props: Props) {
  const { artefact, onClose } = props;
  const { dataStore } = useServices();
  const [license, setLicense] = useState('');
  const name = getTextByLang(artefact.name, getLang());

  useEffect(() => {
    dataStore
      .downloadLicense(artefact)
      .then((license) => setLicense(license))
      .catch((err) => logger.error(err));
  }, [artefact, dataStore]);

  const handleModalClose = useCallback(() => onClose(), [onClose]);

  return (
    <Modal show={true} onHide={handleModalClose} size={'lg'} centered>
      <Modal.Header data-cy={'license-header'}>
        <Modal.Title>
          {name} : {t('Licence')} <FaIcon icon={IconDefs.faBalanceScale} className={'ml-2'} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre className={Cls.licenseView} dangerouslySetInnerHTML={{ __html: linkify(license) }} />
      </Modal.Body>
      <Modal.Footer>
        <button className={'btn btn-outline-secondary'} onClick={handleModalClose} data-cy={'close-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default withTranslation()(LicenseModal);
