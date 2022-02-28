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

import Cls from './ImageSlider.module.scss';
import { MouseEvent } from 'react';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { prefixedTranslation } from '../../../../i18n/i18n';

const t = prefixedTranslation('DataStoreView:');

interface Props {
  urls: string[];
  attributions: string;
  onClick: () => void;
  className?: string;
  buttonSize?: string;
}

function ImageSlider(props: Props) {
  const { urls, attributions, onClick, className, buttonSize } = props;
  const [activePreview, setActivePreview] = useState<string>(urls[0]);

  // Change current image, in specified direction. +1 for next, -1 for previous.
  const changePreview = useCallback(
    (direction: number) => {
      if (!activePreview) {
        return;
      }

      let index = urls.findIndex((url) => url === activePreview) + direction;
      if (index < 0) {
        index = 0;
      }
      if (index >= urls.length) {
        index = urls.length - 1;
      }

      setActivePreview(urls[index]);
    },
    [activePreview, urls]
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
      {/* Preview */}
      {activePreview && <img src={activePreview} alt={t('Preview_of_artifact')} onClick={onClick} />}

      {urls.length > 1 && (
        <>
          <button className={clsx(Cls.button, Cls.left)} onClick={handlePrevious}>
            <FaIcon icon={IconDefs.faArrowCircleLeft} size={buttonSize || '2rem'} />
          </button>
          <button className={clsx(Cls.button, Cls.right)} onClick={handleNext}>
            <FaIcon icon={IconDefs.faArrowCircleRight} size={buttonSize || '2rem'} />
          </button>
        </>
      )}

      <div className={Cls.attributions}>{attributions}</div>
    </div>
  );
}

export default withTranslation()(ImageSlider);
