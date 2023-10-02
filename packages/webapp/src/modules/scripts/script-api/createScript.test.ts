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

import { createScript } from './createScript';
import { ScriptContext } from './ScriptContext';
import sinon from 'sinon';
import { ModuleApi } from '@abc-map/module-api';
import { ScriptApi } from './ScriptApi';

describe('createScript', () => {
  it('should work', async () => {
    // Prepare
    const logStub = sinon.stub();
    const context: ScriptContext = {
      moduleApi: { type: 'module-api' } as unknown as ModuleApi,
      scriptApi: { type: 'script-api' } as unknown as ScriptApi,
      log: logStub,
    };

    const content = `\
log(log.toString());
log(JSON.stringify(moduleApi));
log(JSON.stringify(scriptApi));

function wait(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), n);
    });
}

await wait(200);
log('Waited');
`;

    // Act
    const script = createScript(content);
    await script(context);

    // Assert
    expect(script).toMatchSnapshot();
    expect(logStub.args).toMatchSnapshot();
  });
});
