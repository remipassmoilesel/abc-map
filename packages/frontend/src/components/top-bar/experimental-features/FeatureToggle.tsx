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

import { withTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { prefixedTranslation } from '../../../i18n/i18n';
import { Switch } from '../../switch/Switch';
import { ExperimentalFeature } from '../../../ExperimentalFeatures';

interface Props {
  feature: ExperimentalFeature;
  state: boolean;
  onChange: (feature: ExperimentalFeature, state: boolean) => void;
}

const t = prefixedTranslation('ExperimentalFeaturesModal:');

function FeatureToggle(props: Props) {
  const { feature, onChange, state } = props;

  const handleChange = useCallback(() => {
    onChange(feature, !state);
  }, [onChange, feature, state]);

  return (
    <div onClick={handleChange} className={'d-flex flex-row align-items-center justify-content-between mb-3 cursor-pointer'}>
      {t(feature.id)}
      <Switch onChange={handleChange} value={state} className={'ml-3'} />
    </div>
  );
}

export default withTranslation()(FeatureToggle);
