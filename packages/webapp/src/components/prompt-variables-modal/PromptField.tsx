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

import { PromptDefinition } from '../../core/ui/PromptDefinition';
import { getLang } from '../../i18n/i18n';
import { getTextByLang } from '@abc-map/shared';
import { ChangeEvent, useCallback } from 'react';
import { VariableMap } from '../../core/utils/variableExpansion';

interface Props {
  definition: PromptDefinition;
  value: VariableMap;
  onChange: (res: VariableMap) => void;
}

export function PromptField(props: Props) {
  const { definition, value: valueMap, onChange } = props;
  const description = getTextByLang(definition.description, getLang()) || '';
  const inputValue = valueMap[definition.name] || '';

  const handleInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      let value: string | number;
      switch (definition.type) {
        case 'string':
          value = ev.target.value;
          break;
        case 'number':
          value = parseInt(ev.target.value);
          break;
      }

      onChange({ ...valueMap, [definition.name]: value });
    },
    [definition.name, definition.type, onChange, valueMap]
  );

  return (
    <div className={'d-flex flex-column mb-3'}>
      <div dangerouslySetInnerHTML={{ __html: description }} className={'mb-2'} />

      {definition.type === 'string' && <input type={'text'} value={inputValue} onChange={handleInputChange} className={'form-control'} />}
      {definition.type === 'number' && <input type={'number'} value={inputValue} onChange={handleInputChange} className={'form-control'} />}
    </div>
  );
}
