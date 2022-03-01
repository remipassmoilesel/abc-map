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
import Cls from './LicenceModal.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { getLang, prefixedTranslation } from '../../../i18n/i18n';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { linkify } from '../../../core/utils/strings';
import clsx from 'clsx';
import { attributionsVariableExpansion } from '../../../core/utils/variableExpansion';
import { FoldingInfo } from '../../../components/folding-info/FoldingInfo';

const logger = Logger.get('LicenceModal.tsx');

const t = prefixedTranslation('DataStoreView:');

interface Props {
  artefact: AbcArtefact;
  className?: string;
}

function LicenceModal(props: Props) {
  const { artefact, className } = props;
  const { dataStore } = useServices();
  const [visible, setVisible] = useState(false);
  const [license, setLicense] = useState('');
  const name = getTextByLang(artefact.name, getLang());
  const attributions = attributionsVariableExpansion(artefact.attributions).join('\n');

  useEffect(() => {
    dataStore
      .downloadLicense(artefact)
      .then((license) => setLicense(license))
      .catch((err) => logger.error(err));
  }, [artefact, dataStore]);

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => setVisible(false), []);

  return (
    <>
      <button onClick={handleOpen} className={clsx(Cls.openButton, className, 'btn btn-link')} data-cy={'show-license'}>
        {t('Licence_and_terms_of_use')}
        <FaIcon icon={IconDefs.faBalanceScale} className={'ml-2'} />
      </button>

      {visible && (
        <Modal show={true} onHide={handleClose} size={'lg'} centered>
          <Modal.Header data-cy={'licence-header'}>
            <Modal.Title>
              {t('Licence_and_terms_of_use')} <FaIcon icon={IconDefs.faBalanceScale} className={'ml-2'} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={Cls.modalBody}>
            <h1>{name}</h1>

            <FoldingInfo title={'ℹ️ ' + t('About_data_store')} className={Cls.section}>
              <div dangerouslySetInnerHTML={{ __html: t('About_data_store_and_data') }} />
            </FoldingInfo>

            <div className={Cls.section}>
              <h2>{t('Source')}</h2>
              <div>
                {t('Provider')}: {artefact.provider}
              </div>
              <div>
                <a href={artefact.link} rel="noreferrer" target={'_blank'}>
                  {artefact.link}
                </a>
              </div>
            </div>

            <div className={Cls.section}>
              <h2>{t('Attributions')}</h2>
              <div>{attributions}</div>
            </div>

            <div className={Cls.section}>
              <h2>{t('Licence')}</h2>
              <pre className={Cls.licenceBlock} dangerouslySetInnerHTML={{ __html: linkify(license) }} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className={'btn btn-outline-secondary'} onClick={handleClose} data-cy={'close-modal'}>
              {t('Close')}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default withTranslation()(LicenceModal);
