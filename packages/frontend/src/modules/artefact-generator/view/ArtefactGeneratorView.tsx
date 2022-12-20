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

import Cls from './ArtefactGeneratorView.module.scss';
import { withTranslation } from 'react-i18next';
import { ExportProgress, Parameters, ProgressHandler } from '../typings';
import React, { ChangeEvent, useCallback, useState } from 'react';
import clsx from 'clsx';
import { I18nInput } from './I18nInput';
import { useServices } from '../../../core/useServices';
import { I18nText, Logger, LayerType, AbcView } from '@abc-map/shared';
import { errorMessage } from '../../../core/utils/errorMessage';
import { ModuleContainer } from '../../../components/module-container/ModuleContainer';
import { ModuleTitle } from '../../../components/module-title/ModuleTitle';

const logger = Logger.get('ArtefactGeneratorView.tsx');

interface Props {
  initialValue: Parameters;
  onChange: (params: Parameters) => void;
  onProcess: (onProgress: ProgressHandler) => Promise<void>;
}

function ArtefactGeneratorView(props: Props) {
  const { initialValue, onProcess, onChange } = props;
  const { toasts } = useServices();
  const [parameters, setParameters] = useState(initialValue);
  const [progress, setProgress] = useState<ExportProgress | undefined>();
  const [viewsJson, setViewsJson] = useState('');
  const [parseError, setParseError] = useState<string | undefined>();

  const handleTypeChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const value = ev.target.value as LayerType;
      const updatedParams = { ...parameters, type: value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleXyzChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, xyz: { ...parameters.xyz, url: ev.target.value.trim() } };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleWmsChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, wms: { ...parameters.wms, url: ev.target.value.trim() } };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleWmtsChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, wmts: { ...parameters.wmts, url: ev.target.value.trim() } };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleUsernameChanged = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = {
        ...parameters,
        auth: {
          ...parameters.auth,
          password: parameters.auth?.password || '',
          username: ev.target.value.trim(),
        },
      };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handlePasswordChanged = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = {
        ...parameters,
        auth: {
          ...parameters.auth,
          username: parameters.auth?.username || '',
          password: ev.target.value.trim(),
        },
      };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleProviderChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, provider: ev.target.value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleLicenseChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement>) => {
      const updatedParams = { ...parameters, license: ev.target.value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleAttributionsChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement>) => {
      const updatedParams = { ...parameters, attributions: ev.target.value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleNameChange = useCallback(
    (value: I18nText[]) => {
      const updatedParams = { ...parameters, name: value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleDescriptionChange = useCallback(
    (value: I18nText[]) => {
      const updatedParams = { ...parameters, description: value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleKeywordChange = useCallback(
    (value: I18nText[]) => {
      const updatedParams = { ...parameters, keywords: value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleLinkChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, link: ev.target.value };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handlePreviewsChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, previews: { ...parameters.previews, enabled: ev.target.checked } };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleViewsChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement>) => {
      const value = ev.target.value;
      setViewsJson(value);

      try {
        const views: AbcView[] = JSON.parse(value);
        if (!views || views.constructor.name !== 'Array' || !views.length) {
          setParseError('Not an array or empty array');
          return;
        }

        const updatedParams = { ...parameters, previews: { ...parameters.previews, views } };
        setParameters(updatedParams);
        onChange(updatedParams);
        setParseError(undefined);
      } catch (err) {
        setParseError(errorMessage(err));
      }
    },
    [onChange, parameters]
  );

  const handleOffsetChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, layerIndexes: { ...parameters.layerIndexes, offset: parseInt(ev.target.value) } };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleLimitChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...parameters, layerIndexes: { ...parameters.layerIndexes, limit: parseInt(ev.target.value) } };
      setParameters(updatedParams);
      onChange(updatedParams);
    },
    [onChange, parameters]
  );

  const handleProcess = useCallback(() => {
    toasts.info("Let's go !");
    onProcess(setProgress)
      .then(() => toasts.info('Done !'))
      .catch((err) => {
        logger.error('Processing error: ', err);
        toasts.genericError(err);
      });
  }, [onProcess, toasts]);

  return (
    <ModuleContainer>
      <ModuleTitle>Artefact generator (English only) 😕</ModuleTitle>

      <div className={'mb-4'}>Using this module you can generate artifact files and previews, which can then be offered in Abc-Map data stores.</div>

      <div className={'alert alert-info mb-3'}>This module is not yet translated !</div>

      <div className={'alert alert-warning mb-3'}>Warning: if you use credentials, these credentials will be persisted in the artifacts.</div>

      <div className={Cls.section}>
        <h5>Type</h5>
        <select value={parameters.type} onChange={handleTypeChange} className={clsx(Cls.formField, 'form-select')}>
          <option value={LayerType.Xyz}>XYZ</option>
          <option value={LayerType.Wms}>WMS</option>
          <option value={LayerType.Wmts}>WMTS</option>
        </select>
      </div>

      {LayerType.Xyz === parameters.type && (
        <div className={Cls.section}>
          <h5>XYZ URL</h5>
          <input value={parameters.xyz.url} onChange={handleXyzChange} className={clsx(Cls.formField, 'form-control')} />
        </div>
      )}

      {LayerType.Wms === parameters.type && (
        <div className={Cls.section}>
          <h5>WMS capabilities URL</h5>
          <input value={parameters.wms.url} onChange={handleWmsChange} className={clsx(Cls.formField, 'form-control')} />
        </div>
      )}

      {LayerType.Wmts === parameters.type && (
        <div className={Cls.section}>
          <h5>WMTS capabilities URL</h5>
          <input value={parameters.wmts.url} onChange={handleWmtsChange} className={clsx(Cls.formField, 'form-control')} />
        </div>
      )}

      <div className={Cls.section}>
        <h5>Basic authentication (optional)</h5>
        <input
          placeholder={'Username'}
          value={parameters.auth?.username || ''}
          onChange={handleUsernameChanged}
          className={clsx(Cls.formField, 'form-control')}
        />
        <input
          placeholder={'Password'}
          value={parameters.auth?.password || ''}
          onChange={handlePasswordChanged}
          className={clsx(Cls.formField, 'form-control')}
        />
      </div>

      <div className={Cls.section}>
        <h5>Name</h5>
        <I18nInput value={parameters.name} onChange={handleNameChange} className={Cls.formField} />
      </div>

      <div className={Cls.section}>
        <h5>Provider</h5>
        <input type={'text'} value={parameters.provider} onChange={handleProviderChange} className={clsx(Cls.formField, 'form-control')} />
      </div>

      <div className={Cls.section}>
        <h5>Description</h5>
        <I18nInput value={parameters.description} onChange={handleDescriptionChange} className={Cls.formField} />
      </div>

      <div className={Cls.section}>
        <h5>Keywords</h5>
        <div className={'mb-2 text-secondary'}>(Séparez les mots clés par des points virgule)</div>
        <I18nInput value={parameters.keywords} onChange={handleKeywordChange} className={Cls.formField} />
      </div>

      <div className={Cls.section}>
        <h5>Licence</h5>
        <textarea value={parameters.license} onChange={handleLicenseChange} className={clsx(Cls.formField, 'form-control')} rows={10} />
      </div>

      <div className={Cls.section}>
        <h5>Attributions</h5>
        <textarea value={parameters.attributions} onChange={handleAttributionsChange} className={clsx(Cls.formField, 'form-control')} />
      </div>

      <div className={Cls.section}>
        <h5>Source link</h5>
        <input type={'text'} value={parameters.link} onChange={handleLinkChange} className={clsx(Cls.formField, 'form-control')} />
      </div>

      <div className={Cls.section}>
        <label>
          <input type={'checkbox'} checked={parameters.previews.enabled} onChange={handlePreviewsChange} className={'mr-2'} />
          Create previews
        </label>
      </div>

      <div className={Cls.section}>
        <h5>Preview views</h5>
        <textarea value={viewsJson} onChange={handleViewsChange} className={clsx(Cls.formField, 'form-control')} />
        {parseError && <div className={'text-danger'}>{parseError}</div>}
      </div>

      {parameters.type !== LayerType.Xyz && (
        <div className={Cls.section}>
          <h5>Limit export</h5>
          <div className={'d-flex mt-3'}>
            <label className={clsx('d-flex align-items-center', Cls.formField)}>
              Offset:
              <input type={'number'} value={parameters.layerIndexes.offset} onChange={handleOffsetChange} className={'form-control ml-2'} />
            </label>
            <label className={clsx('d-flex align-items-center', Cls.formField)}>
              Limit:
              <input type={'number'} value={parameters.layerIndexes.limit} onChange={handleLimitChange} className={'form-control ml-2'} />
            </label>
          </div>
        </div>
      )}

      <div className={Cls.section}>
        <button onClick={handleProcess} className={'btn btn-primary'}>
          Generate
        </button>
      </div>

      {progress && (
        <div className={'mb-3'}>
          Progress: {progress.done}/{progress.total}
        </div>
      )}
    </ModuleContainer>
  );
}

export default withTranslation()(ArtefactGeneratorView);
