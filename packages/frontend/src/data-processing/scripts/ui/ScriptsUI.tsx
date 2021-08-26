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

import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import CodeEditor from './CodeEditor';
import Cls from './ScriptsUI.module.scss';
import { ScriptError } from '../typings';

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

class ScriptsUI extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { content: this.props.initialValue, message: '', output: [] };
  }

  public render(): ReactNode {
    const content = this.state.content;
    const message = this.state.message;
    const output = this.state.output;

    return (
      <div className={Cls.panel}>
        <div className={'mb-2'}>
          <p>Le module d&apos;exécution de scripts permet de traiter les données de la carte de manière programmatique en écrivant du code Javascript.</p>
          <p>Gardez en tête ces recommandations: </p>
          <ul>
            <li>Si vous ne comprenez pas à quoi sert ce module, ne l&apos;utilisez pas</li>
            <li>N&apos;exécutez pas du code que vous ne comprenez pas</li>
            <li>Les actions effectuées par un script ne peuvent pas être annulées</li>
          </ul>
        </div>

        <div className={'alert alert-danger my-2'}>
          <i className={'fa fa-exclamation-triangle mr-2'} />
          Une mauvaise utilisation de ce module peut présenter un risque de sécurité
        </div>

        <CodeEditor initialContent={content} onChange={this.handleChange} />

        <div className={'d-flex justify-content-end'}>
          {message && (
            <div className={Cls.message} data-cy={'message'}>
              {message}
            </div>
          )}
          <button className={'btn btn-primary mt-3'} onClick={this.execute} data-cy={'execute'}>
            Exécuter
          </button>
        </div>

        {!!output.length && (
          <div className={Cls.output}>
            Sortie:
            <pre data-cy={'output'}>{output.join('\n')}</pre>
          </div>
        )}
      </div>
    );
  }

  private execute = () => {
    this.props
      .onProcess()
      .then((output) => this.setState({ message: 'Script exécuté sans erreurs.', output }))
      .catch((err: ScriptError | Error) => {
        logger.error('Script error: ', err);
        const output = 'output' in err ? err.output : [];
        this.setState({ message: err.message, output });
      });
  };

  private handleChange = (content: string) => {
    this.setState({ content });
    this.props.onChange(content);
  };
}

export default ScriptsUI;
