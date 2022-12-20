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

import { ScriptsView } from './view/ScriptsView';
import React from 'react';
import { Logger } from '@abc-map/shared';
import { ChromiumErrorRegexp, ErrorPosition, Example, FirefoxErrorRegexp, ScriptArguments, ScriptError } from './typings';
import { errorMessage } from '../../core/utils/errorMessage';
import { ModuleAdapter, ModuleId } from '@abc-map/module-api';
import { LocalModuleId } from '../LocalModuleId';
import { prefixedTranslation } from '../../i18n/i18n';
import { getModuleApi } from '../../core/modules/registry/getModuleApi';

const t = prefixedTranslation('ScriptsModule:');

export const logger = Logger.get('Scripts.tsx', 'info');

export class Scripts extends ModuleAdapter {
  private scriptContent = Example;

  public getId(): ModuleId {
    return LocalModuleId.Scripts;
  }

  public getReadableName(): string {
    return t('Running_scripts');
  }

  public getShortDescription(): string {
    return t('Script_module_allow_advanced_data_modification');
  }

  public getView() {
    return <ScriptsView initialValue={this.scriptContent} onProcess={() => this.process(this.scriptContent)} onChange={this.handleScriptChange} />;
  }

  public async process(content: string): Promise<string[]> {
    const output: string[] = [];
    function log(data: object | undefined) {
      logger.info('log()', data);
      output.push(data?.toString() || 'undefined');
    }

    const args: ScriptArguments = {
      moduleApi: getModuleApi(),
      log,
    };

    const script = createScript(args, content);

    try {
      script(...Object.values(args));
      return output;
    } catch (err) {
      const position = parseError(err);
      let message: string;
      if (position) {
        message = `Error line ${position.line}, column ${position.column}.`;
      } else {
        message = `Error at unknown position.`;
      }
      message += ` Message: ${errorMessage(err)}`;

      const error = new ScriptError(message, output);
      return Promise.reject(error);
    }
  }

  private handleScriptChange = (content: string) => {
    this.scriptContent = content;
  };
}

export function createScript(args: ScriptArguments, content: string): Function {
  const header = `"use strict";\n`;
  // eslint-disable-next-line no-new-func
  return new Function(...Object.keys(args), header + content);
}

export function parseError(error: Error | unknown | any): ErrorPosition | undefined {
  const stack = error?.stack;
  if (typeof stack !== 'string') {
    return;
  }

  const ffMatch = stack.match(FirefoxErrorRegexp);
  const chMatch = stack.match(ChromiumErrorRegexp);
  const match = ffMatch || chMatch;
  if (!match) {
    return;
  }

  const line = parseInt(match[1]) - 3; // 3 is the default offset
  const column = parseInt(match[2]);
  return { line, column };
}
