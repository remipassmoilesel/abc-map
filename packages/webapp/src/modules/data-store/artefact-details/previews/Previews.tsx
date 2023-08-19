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

import Cls from './Previews.module.scss';
import { AbcArtefact, getTextByLang, Logger } from '@abc-map/shared';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { getLang, prefixedTranslation } from '../../../../i18n/i18n';
import { attributionsVariableExpansion } from '../../../../core/utils/variableExpansion';
import ImageSlider from './ImageSlider';

const t = prefixedTranslation('DataStoreModule:');

const logger = Logger.get('Previews');

interface Props {
  artefact: AbcArtefact;
  className?: string;
}

function Previews(props: Props) {
  const { artefact, className } = props;
  const [fullscreenPreview, showFullScreenPreview] = useState(false);
  const artefactName = getTextByLang(artefact.name, getLang());
  const attributions = attributionsVariableExpansion(artefact.attributions).join('\n');
  const previewUrls = artefact.previews || [];

  const toggleFullScreenPreview = useCallback(() => showFullScreenPreview(!fullscreenPreview), [fullscreenPreview]);

  return (
    <div className={clsx(Cls.previews, className)}>
      {/* Small preview */}
      {!!previewUrls.length && <ImageSlider urls={previewUrls} attributions={attributions} onClick={toggleFullScreenPreview} className={Cls.smallPreview} />}

      {/* No preview available*/}
      {!previewUrls.length && (
        <div className={Cls.noPreview}>
          <FaIcon icon={IconDefs.faImages} size={'4rem'} className={'mb-3'} />
          <h5>{t('No_preview_available')}</h5>
        </div>
      )}

      {/* Fullscreen preview */}
      {fullscreenPreview && (
        <div className={Cls.fullscreenModal} onClick={toggleFullScreenPreview} key={artefact.id}>
          <h3>{artefactName}</h3>
          <ImageSlider urls={previewUrls} attributions={attributions} onClick={toggleFullScreenPreview} buttonSize={'3rem'} className={Cls.largePreview} />
        </div>
      )}
    </div>
  );
}

export default withTranslation()(Previews);
