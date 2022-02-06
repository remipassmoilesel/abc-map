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
import { useServices } from '../../../../core/useServices';
import { Modal } from 'react-bootstrap';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { CopyButton } from '../../../../components/copy-button/CopyButton';
import QrCode from '../../../../components/qrcode/QrCode';
import { prefixedTranslation } from '../../../../i18n/i18n';

const t = prefixedTranslation('ShareSettingsView:');

const defaultWidth = Math.round(document.body.clientWidth * 0.8);
const defaultHeight = Math.round(document.body.clientHeight * 0.8);

interface Props {
  onClose: () => void;
}

function SharingCodesModal(props: Props) {
  const { onClose } = props;
  const { project } = useServices();

  const publicLink = project.getPublicLink();
  const shareLinkRef = useRef<HTMLInputElement | null>(null);

  const [iframeWidth, setIframeWidth] = useState(defaultWidth);
  const [iframeHeight, setIframeHeight] = useState(defaultHeight);
  const iframeCode = `<iframe src="${publicLink}" width="${iframeWidth}" height="${iframeHeight}"></iframe>`;
  const iframeCodeRef = useRef<HTMLTextAreaElement | null>(null);

  const handleWidthChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(ev.target.value);
    if (!value || isNaN(value)) {
      value = defaultWidth;
    }
    setIframeWidth(value);
  }, []);

  const handleHeightChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(ev.target.value);
    if (!value || isNaN(value)) {
      value = defaultHeight;
    }
    setIframeHeight(value);
  }, []);

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
                <input type={'text'} value={publicLink} ref={shareLinkRef} readOnly={true} className={'form-control flex-grow-1 mr-3'} data-cy={'public-url'} />
                <CopyButton inputRef={shareLinkRef} />
              </div>

              {/* Iframe integration */}
              <div className={Cls.sectionTitle}>{t('Iframe_embed_code')}</div>
              <div className={Cls.iframeForm}>
                <textarea value={iframeCode} ref={iframeCodeRef} readOnly={true} className={'form-control flex-grow-1 mr-3'} />
                <CopyButton inputRef={iframeCodeRef} />
              </div>
              <div className={Cls.dimensions}>
                <div className={'mr-3'}>{t('Width')}</div>
                <input type={'number'} min={100} value={iframeWidth} onChange={handleWidthChange} className={'form-control mr-3'} />
                <div className={'mr-3'}>{t('Height')}</div>
                <input type={'number'} min={50} value={iframeHeight} onChange={handleHeightChange} className={'form-control mr-3'} />
              </div>
            </div>

            <div className={'col-xl-4 d-flex justify-content-center align-items-center'}>
              <QrCode text={publicLink} width={'15rem'} height={'15rem'} />
            </div>
          </div>

          <div className={'row d-flex mt-4'}>
            <div className={'col-xl-12 d-flex justify-content-end'}>
              <button onClick={onClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SharingCodesModal;
