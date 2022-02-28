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

import Cls from './Previews.module.scss';
import { AbcArtefact, getTextByLang, Logger } from '@abc-map/shared';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../../../core/useServices';
import { resolveInAtLeast } from '../../../../core/utils/resolveInAtLeast';
import { BlueLoader } from '../../../../components/blue-loader/BlueLoader';
import clsx from 'clsx';
import { getLang, prefixedTranslation } from '../../../../i18n/i18n';
import { attributionsVariableExpansion } from '../../../../core/utils/variableExpansion';
import ImageSlider from './ImageSlider';

const t = prefixedTranslation('DataStoreView:');

const logger = Logger.get('Previews');

interface Props {
  artefact: AbcArtefact;
  className?: string;
}

function Previews(props: Props) {
  const { artefact, className } = props;
  const { dataStore } = useServices();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activePreview, setActivePreview] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [fullscreenPreview, showFullScreenPreview] = useState(false);
  const artefactName = getTextByLang(artefact.name, getLang());
  const attributions = attributionsVariableExpansion(artefact.attributions).join('\n');

  // Load previews
  useEffect(() => {
    // No preview, we do not load
    if (!artefact.previews?.length) {
      setPreviewUrls([]);
      setActivePreview(undefined);
      return;
    }

    setLoading(true);

    const urls: string[] = [];
    resolveInAtLeast(dataStore.downloadPreviewsFrom(artefact), 250)
      .then((files) => {
        urls.push(...files.map((file) => URL.createObjectURL(file.content)));
        setPreviewUrls(urls);
        setActivePreview(urls[0]);
      })
      .catch((err) => logger.error('Preview error: ', err))
      .finally(() => setLoading(false));

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [artefact, dataStore]);

  const toggleFullScreenPreview = useCallback(() => showFullScreenPreview(!fullscreenPreview), [fullscreenPreview]);

  return (
    <div className={clsx(Cls.previews, className)}>
      {loading && (
        <div className={Cls.loading}>
          <BlueLoader />
        </div>
      )}

      {!loading && (
        <>
          {/* Small preview */}
          {!!previewUrls.length && (
            <ImageSlider urls={previewUrls} attributions={attributions} onClick={toggleFullScreenPreview} className={Cls.smallPreview} />
          )}

          {/* No preview available*/}
          {!previewUrls.length && (
            <div className={Cls.noPreview}>
              <FaIcon icon={IconDefs.faImages} size={'4rem'} className={'mb-3'} />
              <h5>{t('No_preview_available')}</h5>
            </div>
          )}

          {/* Fullscreen preview */}
          {fullscreenPreview && activePreview && (
            <div className={Cls.fullscreenModal} onClick={toggleFullScreenPreview}>
              <h3>{artefactName}</h3>
              <ImageSlider urls={previewUrls} attributions={attributions} onClick={toggleFullScreenPreview} buttonSize={'3rem'} className={Cls.largePreview} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default withTranslation()(Previews);
