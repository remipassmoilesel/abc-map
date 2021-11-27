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

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import FormValidationLabel from '../../../../../components/form-validation-label/FormValidationLabel';
import { ValidationHelper } from '../../../../../core/utils/ValidationHelper';
import { FormState } from '../../../../../components/form-validation-label/FormState';
import ControlButtons from '../_common/ControlButtons';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../../../core/history/tasks/layers/AddLayersTask';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { useServices } from '../../../../../core/hooks';

const logger = Logger.get('XYZLayerPanel.tsx');

const t = prefixedTranslation('MapView:AddLayerModal.');

interface Props {
  url: string;
  onChange: (xyzUrl: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function XYZLayerPanel(props: Props) {
  const { history, geo } = useServices();
  const [formState, setFormState] = useState(FormState.InvalidUrl);
  const { url, onCancel, onConfirm, onChange } = props;
  const submitDisabled = formState !== FormState.Ok;
  const wrongPlaceholders = getWrongPlaceholders(url);

  const validateForm = useCallback((url: string): FormState => {
    if (!ValidationHelper.url(url)) {
      return FormState.InvalidUrl;
    }

    if (!ValidationHelper.xyzUrl(url)) {
      return FormState.MissingXYZPlaceHolders;
    }

    return FormState.Ok;
  }, []);

  const handleConfirm = useCallback(() => {
    const map = geo.getMainMap();
    const layer = LayerFactory.newXyzLayer(url);
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));

    onConfirm();
  }, [geo, url, history, onConfirm]);

  const handleUrlChanged = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      setFormState(validateForm(value));
      onChange(ev.target.value);
    },
    [onChange, validateForm]
  );

  // We validate pre-existing URL
  useEffect(() => setFormState(validateForm(url)), [url, validateForm]);

  return (
    <div className={'flex-grow-1 d-flex flex-column justify-content-between'}>
      {/* Url form */}
      <div className={'d-flex flex-column'}>
        <input type={'text'} value={url} onChange={handleUrlChanged} className={'form-control mb-3'} placeholder={t('URL')} data-cy={'xyz-settings-url'} />

        {/* Explanation on what type of URL is expected */}
        <div className={'alert alert-info mb-3'}>
          <div dangerouslySetInnerHTML={{ __html: t('URL_must_contains_placeholders') }} />
          <div dangerouslySetInnerHTML={{ __html: t('Example_url_with_placeholders') }} />
        </div>

        {/* Warning if weird placeholders are used */}
        {!!wrongPlaceholders.length && (
          <div className={'alert alert-warning'} data-testid={'placeholder-warning'}>
            <div>
              <span dangerouslySetInnerHTML={{ __html: t('Some_placeholders_are_wrong') }} /> <code>{wrongPlaceholders.join(' ')}</code>
            </div>
            <div dangerouslySetInnerHTML={{ __html: t('Use_double_placeholders') }} />
          </div>
        )}
      </div>

      {/* Form validation */}
      <FormValidationLabel state={formState} />

      {/* Control buttons */}
      <ControlButtons submitDisabled={submitDisabled} onCancel={onCancel} onConfirm={handleConfirm} />
    </div>
  );
}

function getWrongPlaceholders(url: string): string[] {
  const correctPlaceholders = ['{x}', '{y}', '{z}'];
  const placeholders = url.match(/\{[^}]+}/gi);
  const wrong = placeholders
    ?.map((match) => match)
    .filter((match) => !correctPlaceholders.includes(match))
    .filter((match) => !match.match(/^\{[a-z]{1}-[a-z]{1}}$/));
  return wrong || [];
}

export default withTranslation()(XYZLayerPanel);
