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

import Cls from './SharingCodesModal.module.scss';
import { useServices } from '../../core/useServices';
import { Modal } from 'react-bootstrap';
import React from 'react';
import { CopyToClipboardButton } from '../copy-to-clipboard-button/CopyToClipboardButton';
import { QrCode } from '../qrcode/QrCode';
import { useAppSelector } from '../../core/store/hooks';
import { adaptMapDimensions } from '../../core/project/adaptMapDimensions';
import { SmallAdvice } from '../small-advice/SmallAdvice';
import { classicIframeIntegration, responsiveIframeIntegration } from './integrations';
import { useTranslation } from 'react-i18next';
import { AbcProjectMetadata } from '@abc-map/shared';

interface Props {
  project: AbcProjectMetadata;
  onClose: () => void;
}

export function SharingCodesModal(props: Props) {
  const { project, onClose } = props;
  const { project: projectService } = useServices();
  const { t } = useTranslation('SharingCodesModal');

  const publicLink = projectService.getPublicLink(project.id);
  const sharedMapProperties = useAppSelector((st) => st.project.sharedViews);
  const { width, height } = adaptMapDimensions(sharedMapProperties.fullscreen, sharedMapProperties.mapDimensions);

  const simpleIframeCode = classicIframeIntegration(publicLink, width, height);
  const responsiveIframeCode = responsiveIframeIntegration(publicLink, width, height);

  return (
    <Modal show={true} onHide={onClose} size={'lg'} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Sharing_codes')} 🔗</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'container'}>
          <div className={'row'}>
            <div className={'col-xl-8'}>
              {/* Sharing link */}
              <div className={Cls.sectionTitle}>{t('Share_link')}</div>
              <div className={Cls.shareLinkForm}>
                <input type={'text'} value={publicLink} readOnly={true} className={'form-control flex-grow-1 mr-3'} data-cy={'public-url'} />
                <CopyToClipboardButton value={publicLink} />
              </div>

              {/* Responsive iframe integration */}
              <div className={Cls.sectionTitle}>
                {t('Responsive_iframe_embed_code')}
                <SmallAdvice advice={t('Responsive_iframe_embed_code_will_adapt_better')} />
              </div>
              <div className={Cls.iframeForm}>
                <textarea value={responsiveIframeCode} readOnly={true} className={'form-control flex-grow-1 mr-3'} />
                <CopyToClipboardButton value={responsiveIframeCode} />
              </div>

              {/* Normal iframe integration */}
              <div className={Cls.sectionTitle}>{t('Iframe_embed_code')}</div>
              <div className={Cls.iframeForm}>
                <textarea value={simpleIframeCode} readOnly={true} className={'form-control flex-grow-1 mr-3'} />
                <CopyToClipboardButton value={simpleIframeCode} />
              </div>
            </div>

            <div className={'col-xl-4 d-flex flex-column justify-content-center align-items-center'}>
              <div className={Cls.sectionTitle}>{t('Qrcode_link')}</div>
              <QrCode text={publicLink} width={'15rem'} height={'15rem'} />
            </div>
          </div>

          <div className={'row d-flex mt-4'}>
            <div className={'col-xl-12 d-flex justify-content-end'}>
              <button onClick={onClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'}>
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
