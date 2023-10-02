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

import React, { useCallback, useState } from 'react';
import { errorMessage, Logger } from '@abc-map/shared';
import { CodeEditor } from './CodeEditor';
import { useTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import { ModuleContainer } from '../../../components/module-container/ModuleContainer';
import { ModuleTitle } from '../../../components/module-title/ModuleTitle';
import { usePersistentStore } from './state';
import Cls from './ScriptsView.module.scss';
import { AllScriptExamples, ScriptExample } from '../examples';
import { useServices } from '../../../core/useServices';
import { getScriptErrorOutput } from '../script-api/errors';

const logger = Logger.get('ScriptsView.tsx');

interface Props {
  onProcess: (script: string) => Promise<string[]>;
}

export function ScriptsView(props: Props) {
  const { onProcess } = props;
  const { geo, toasts } = useServices();
  const { script, setScript } = usePersistentStore();

  const [message, setMessage] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const { t } = useTranslation('ScriptsModule');

  const handleExecute = useCallback(() => {
    onProcess(script)
      .then((output) => {
        setMessage(`✨ ${t('Executed_without_errors')}`);
        setOutput(output);
      })
      .catch((err) => {
        logger.error('Script error: ', err);

        const message = errorMessage(err);
        setMessage(`${t('Error')}: ${message || '<no-message>'}`);

        const output = getScriptErrorOutput(err);
        setOutput(output);
      });
  }, [onProcess, script, t]);

  const handleChange = useCallback((content: string) => setScript(content), [setScript]);

  const [exampleLoading, setExampleLoading] = useState(false);
  const loadExample = useCallback(
    (example: ScriptExample) => {
      setExampleLoading(true);

      example
        .setup(geo.getMainMap())
        .then(() => fetch(example.codeUrl))
        .then((response) => response.text())
        .then((scriptContent) => {
          setScript(scriptContent);
          toasts.info(t('Example_loaded'));
        })
        .catch((err) => {
          logger.error('Example loading error: ', err);
          toasts.genericError(err);
        })
        .finally(() => setExampleLoading(false));
    },
    [geo, setScript, t, toasts]
  );

  return (
    <ModuleContainer>
      <ModuleTitle>{t('Running_scripts')}</ModuleTitle>

      <div className={'mb-2'}>
        <p>{t('Script_module_allow_advanced_data_modification')}</p>
        <p>{t('Keep_in_mind_recommendations')}: </p>
        <ul>
          <li>{t('Dont_use_it_if_you_dont_understand_it')}</li>
          <li>{t('Dont_run_code_you_dont_understand')}</li>
          <li>{t('Actions_cannot_be_undone')}</li>
        </ul>
      </div>

      <div className={'alert alert-danger mb-4'}>
        <FaIcon icon={IconDefs.faExclamationTriangle} className={'mr-2'} size={'1.2rem'} />
        {t('Improper_use_can_cause_security_issue')}
      </div>

      <div className={'my-2 d-flex'}>
        <div className={'me-2'}>{t('Do_you_want_to_load_an_example')}</div>

        {AllScriptExamples.map((example) => (
          <button
            key={example.i18n_key}
            data-cy={'load-example-' + example.id}
            onClick={() => loadExample(example)}
            className={'btn btn-sm btn-outline-primary me-2'}
            disabled={exampleLoading}
          >
            {t(example.i18n_key)}
          </button>
        ))}
      </div>

      <div className={Cls.editorContainer}>
        <CodeEditor content={script} onChange={handleChange} />
      </div>

      <div className={'d-flex justify-content-end'}>
        <button className={'btn btn-primary mt-3'} onClick={handleExecute} data-cy={'execute'}>
          {t('Execute')}
        </button>
      </div>

      {message && (
        <div className={Cls.message} data-cy={'message'}>
          {message}
        </div>
      )}

      {!!output.length && (
        <div className={Cls.output}>
          {t('Output')}: <pre data-cy={'output'}>{output.join('\n')}</pre>
        </div>
      )}
    </ModuleContainer>
  );
}
