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

import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { BlobIO, Logger } from '@abc-map/shared';
import { FileIO } from '../../core/utils/FileIO';
import { useServices } from '../../core/useServices';
import { useTranslation } from 'react-i18next';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';

const logger = Logger.get('QrCode.tsx');

interface Props {
  text: string;
  width: string;
  height: string;
}

export function QrCode(props: Props) {
  const { text, width, height } = props;
  const { t } = useTranslation('QrCode');
  const { toasts } = useServices();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const qrCodeRef = useRef<Blob>();
  const [downloadDisabled, setDownloadDisabled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) {
      logger.debug('Cannot display code, not ready');
      return;
    }

    QRCode.toCanvas(canvas, text, function (error) {
      if (error) {
        logger.error('Qrcode generation error: ', error);
        return;
      }

      image.src = canvas.toDataURL('image/jpg', 1);
      image.style.width = width;
      image.style.height = height;

      canvas.width = 0;
      canvas.height = 0;
      canvas.style.width = width;
      canvas.style.height = height;

      BlobIO.blobUrlToBlob(image.src)
        .then((res) => {
          qrCodeRef.current = res;
          setDownloadDisabled(false);
        })
        .catch((err) => {
          logger.error('Blob error: ', err);
          setDownloadDisabled(true);
        });
    });
  }, [height, text, width]);

  const handleDownloadQrCode = useCallback(() => {
    if (qrCodeRef.current) {
      FileIO.downloadBlob(qrCodeRef.current, 'qrcode.jpg');
    } else {
      toasts.genericError();
    }
  }, [toasts]);

  return (
    <div className={'d-flex flex-column align-items-center'}>
      <div style={{ position: 'relative', width, height }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', width, height }} />
        {/* We use an image in order to allow users to save qrcode with right click */}
        <img ref={imageRef} style={{ position: 'absolute', width, height }} alt={text} />
      </div>

      <button onClick={handleDownloadQrCode} disabled={downloadDisabled} className={'btn btn-sm btn-outline-secondary'}>
        <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
        {t('Download')}
      </button>
    </div>
  );
}
