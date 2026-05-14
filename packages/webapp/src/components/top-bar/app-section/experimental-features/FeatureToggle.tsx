/**
 * Copyright © 2026 Rémi Pace.
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

import Cls from './FeatureToggle.module.scss';
import { useTranslation } from 'react-i18next';
import type { SyntheticEvent } from 'react';
import React, { useCallback } from 'react';
import { getLang } from '../../../../i18n/i18n';
import { Switch } from '../../../switch/Switch';
import type { ExperimentalFeature } from '../../../../experimental-features';
import { getTextByLang } from '@abc-map/shared';
import { linkify } from '../../../../core/utils/strings';

interface Props {
  feature: ExperimentalFeature;
  state: boolean;
  onChange: (feature: ExperimentalFeature, state: boolean) => void;
  disabled?: boolean;
  'data-cy'?: string;
}

export function FeatureToggle(props: Props) {
  const { feature, onChange, state, disabled, 'data-cy': dataCy } = props;
  const description = getTextByLang(feature.description, getLang());
  const { t } = useTranslation('ExperimentalFeaturesModal');

  const handleChange = useCallback(
    (ev: SyntheticEvent) => {
      if (!disabled) {
        ev.stopPropagation();
        onChange(feature, !state);
      }
    },
    [disabled, onChange, feature, state],
  );

  return (
    <div onClick={handleChange} className={Cls.featureToggle} data-cy={dataCy}>
      <div className={'d-flex flex-row align-items-center justify-content-between mb-2'}>
        {t(feature.id)}
        <Switch onChange={handleChange} value={state} className={'ml-3'} disabled={disabled} />
      </div>
      {description && <small dangerouslySetInnerHTML={{ __html: linkify(description) }}></small>}
    </div>
  );
}
