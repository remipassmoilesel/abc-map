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

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('QrCode.tsx');

interface Props {
  text: string;
  width: string;
  height: string;
}

function QrCode(props: Props) {
  const { text, width, height } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
    });
  }, [text]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', width, height }} />
      {/* We use an image in order to allow users to save qrcode with right click */}
      <img ref={imageRef} style={{ position: 'absolute', width, height }} alt={text} />
    </div>
  );
}

export default QrCode;
