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

import { ScriptsView } from './view/ScriptsView';
import React from 'react';
import { errorMessage, Logger, ModuleId } from '@abc-map/shared';
import type { ScriptContext } from './script-api/ScriptContext';
import { prefixedTranslation } from '../../i18n/i18n';
import { createScript } from './script-api/createScript';
import { getServices } from '../../core/Services';
import { parseError, ScriptError } from './script-api/errors';
import { getScriptApi } from './script-api/ScriptApi';
import type { AbcModule } from '../AbcModule.ts';

const t = prefixedTranslation('ScriptsModule');

export const logger = Logger.get('Scripts.tsx', 'warn');

export class ScriptsModule implements AbcModule {
  public getId() {
    return ModuleId.Scripts;
  }

  public getReadableName(): string {
    return t('Running_scripts');
  }

  public getShortDescription(): string {
    return t('Script_module_allow_advanced_data_modification');
  }

  public getView() {
    return () => <ScriptsView onProcess={this.process} />;
  }

  public process = async (scriptContent: string): Promise<string[]> => {
    const output: string[] = [];
    function log(data: object | undefined) {
      output.push(data?.toString() || 'undefined');
    }

    const context: ScriptContext = {
      scriptApi: getScriptApi(getServices()),
      log,
    };

    const script = createScript(scriptContent);

    try {
      await script(context);
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

      throw new ScriptError(message, output);
    }
  };
}
