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
import { Example, getScriptErrorOutput } from '../typings';
import { usePersistentStore } from './state';
import Cls from './ScriptsView.module.scss';

const logger = Logger.get('ScriptsView.tsx');

interface Props {
  onProcess: (script: string) => string[];
}

export function ScriptsView(props: Props) {
  const { onProcess } = props;

  const { script, setScript } = usePersistentStore();

  const [message, setMessage] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const { t } = useTranslation('ScriptsModule');

  const handleExecute = useCallback(() => {
    try {
      const output = onProcess(script);
      setMessage(`✨ ${t('Executed_without_errors')}`);
      setOutput(output);
    } catch (err: unknown) {
      logger.error('Script error: ', err);

      const message = errorMessage(err);
      setMessage(`${t('Error')}: ${message || '<no-message>'}`);

      const output = getScriptErrorOutput(err);
      setOutput(output);
    }
  }, [onProcess, script, t]);

  const handleReset = useCallback(() => setScript(Example), [setScript]);

  const handleChange = useCallback((content: string) => setScript(content), [setScript]);

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

      <div className={'alert alert-danger my-2'}>
        <FaIcon icon={IconDefs.faExclamationTriangle} className={'mr-2'} size={'1.2rem'} />
        {t('Improper_use_can_cause_security_issue')}
      </div>

      <div className={Cls.editorContainer}>
        <CodeEditor content={script} onChange={handleChange} />
      </div>

      <div className={'d-flex justify-content-end'}>
        <button className={'btn btn-outline-primary mt-3 me-2'} onClick={handleReset}>
          {t('Default_content')}
        </button>
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
