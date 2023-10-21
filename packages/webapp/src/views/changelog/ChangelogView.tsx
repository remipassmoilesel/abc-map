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

import Cls from './ChangelogView.module.scss';
import React, { useEffect, useState } from 'react';
import { BlobIO, Logger } from '@abc-map/shared';
import { pageSetup } from '../../core/utils/page-setup';
import { useTranslation, withTranslation } from 'react-i18next';
import axios from 'axios';

const logger = Logger.get('ChangelogView.tsx');

function ChangelogView() {
  const { t } = useTranslation('ChangelogView');

  const [changelog, setChangelog] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => pageSetup(t('Changelog')), [t]);

  useEffect(() => {
    axios
      .get('/static/CHANGELOG.html', { responseType: 'blob' })
      .then((res) => BlobIO.asString(res.data))
      .then((content) => setChangelog(content))
      .catch((err) => {
        logger.error('Changelog error: ', err);
        setIsError(true);
      });
  }, []);

  return (
    <div className={Cls.view}>
      <div className={Cls.viewport}>
        <h1 className={'text-center'}>{t('Changelog')}</h1>

        <div className={'d-flex justify-content-center'}>
          <a href={'https://twitter.com/abcmapfr'} target={'_blank'} rel="noreferrer" className={Cls.followLink}>
            {t('Follow_us_on_twitter')} 🐦
          </a>
        </div>

        <div className={'alert alert-info mb-4'}>
          <div className={'fst-italic mb-4'}>🇬🇧 Changelog is only available in English !</div>
          <a target={'_blank'} href={'https://gitlab.com/abc-map/abc-map_private/-/blob/master/CHANGELOG.md'} rel="noreferrer">
            The latest version of the changelog is on Gitlab 🦊
          </a>
        </div>

        <div dangerouslySetInnerHTML={{ __html: changelog }} />

        {isError && <div className={'alert alert-warning'}>{t('Failed_to_load_log_try_again_later')} 🤭</div>}
      </div>
    </div>
  );
}

export default withTranslation()(ChangelogView);
