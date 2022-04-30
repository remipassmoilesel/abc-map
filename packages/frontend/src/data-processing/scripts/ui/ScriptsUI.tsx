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

import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import CodeEditor from './CodeEditor';
import { ScriptError } from '../typings';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import Cls from './ScriptsUI.module.scss';

const logger = Logger.get('ScriptsUI.tsx');

interface Props {
  initialValue: string;
  onProcess: () => Promise<string[]>;
  onChange: (content: string) => void;
}

interface State {
  content: string;
  message: string;
  output: string[];
}

const t = prefixedTranslation('DataProcessingModules:Scripts.');

class ScriptsUI extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { content: this.props.initialValue, message: '', output: [] };
  }

  public render() {
    const content = this.state.content;
    const message = this.state.message;
    const output = this.state.output;

    return (
      <div className={Cls.panel}>
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

        <CodeEditor initialContent={content} onChange={this.handleChange} />

        <div className={'d-flex justify-content-end'}>
          {message && (
            <div className={Cls.message} data-cy={'message'}>
              {message}
            </div>
          )}
          <button className={'btn btn-primary mt-3'} onClick={this.execute} data-cy={'execute'}>
            {t('Execute')}
          </button>
        </div>

        {!!output.length && (
          <div className={Cls.output}>
            {t('Output')}: <pre data-cy={'output'}>{output.join('\n')}</pre>
          </div>
        )}
      </div>
    );
  }

  private execute = () => {
    this.props
      .onProcess()
      .then((output) => this.setState({ message: t('Executed_without_errors'), output }))
      .catch((err: ScriptError | Error) => {
        logger.error('Script error: ', err);
        const output = 'output' in err ? err.output : [];
        this.setState({ message: `${t('Error')}: ${err.message || '<no-message>'}`, output });
      });
  };

  private handleChange = (content: string) => {
    this.setState({ content });
    this.props.onChange(content);
  };
}

export default withTranslation()(ScriptsUI);
