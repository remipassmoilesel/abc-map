/**
 * Copyright © 2023 Rémi Pace.
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

import Cls from './ImageSlider.module.scss';
import { MouseEvent, useEffect } from 'react';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useServices } from '../../../../core/useServices';
import { Logger } from '@abc-map/shared';
import { BlueLoader } from '../../../../components/blue-loader/BlueLoader';
import { resolveInAtLeast } from '../../../../core/utils/resolveInAtLeast';

const logger = Logger.get('ImageSlider.tsx');

const t = prefixedTranslation('DataStoreModule:');

interface Props {
  urls: string[];
  attributions: string;
  onClick: () => void;
  className?: string;
  buttonSize?: string;
}

function ImageSlider(props: Props) {
  const { dataStore, toasts } = useServices();
  const { urls, attributions, onClick, className, buttonSize } = props;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activePreview, setActivePreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < urls.length - 1;

  // Download active preview
  useEffect(() => {
    if (!urls.length) {
      return;
    }

    let objectUrl: string | undefined;
    setLoading(true);
    resolveInAtLeast(dataStore.downloadFile(urls[activeIndex]), 200)
      .then((res) => {
        objectUrl = URL.createObjectURL(res.content);
        setActivePreview(objectUrl);
      })
      .catch((err) => {
        toasts.genericError(err);
        logger.error('Cannot download preview: ', err);
      })
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [activeIndex, dataStore, toasts, urls]);

  // Change current image, in specified direction. +1 for next, -1 for previous.
  const changePreview = useCallback(
    (direction: number) => {
      if (!urls.length) {
        return;
      }

      let index = activeIndex + direction;
      if (index < 0) {
        index = 0;
      }
      if (index >= urls.length) {
        index = urls.length - 1;
      }

      setActiveIndex(index);
    },
    [activeIndex, urls]
  );

  const handlePrevious = useCallback(
    (ev: MouseEvent) => {
      ev.stopPropagation();
      changePreview(-1);
    },
    [changePreview]
  );

  const handleNext = useCallback(
    (ev: MouseEvent) => {
      ev.stopPropagation();
      changePreview(1);
    },
    [changePreview]
  );

  return (
    <div className={clsx(Cls.slider, className)}>
      {/* Loading animation */}
      {loading && (
        <div className={Cls.loading}>
          <BlueLoader />
        </div>
      )}

      {/* Preview */}
      {!loading && activePreview && <img src={activePreview} alt={t('Preview_of_artifact')} onClick={onClick} />}

      {/* Control buttons */}
      {urls.length > 1 && (
        <>
          <button className={clsx(Cls.button, Cls.left)} onClick={handlePrevious} disabled={!hasPrevious}>
            <FaIcon icon={IconDefs.faArrowCircleLeft} size={buttonSize || '2rem'} />
          </button>
          <button className={clsx(Cls.button, Cls.right)} onClick={handleNext} disabled={!hasNext}>
            <FaIcon icon={IconDefs.faArrowCircleRight} size={buttonSize || '2rem'} />
          </button>
        </>
      )}

      <div className={Cls.attributions} dangerouslySetInnerHTML={{ __html: attributions }} />
    </div>
  );
}

export default withTranslation()(ImageSlider);
