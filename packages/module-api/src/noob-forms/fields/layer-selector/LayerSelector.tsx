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

import Cls from '../../NoobFormBuilder.module.scss';
import { LayerSelectorDefinition } from '../../types';
import { FieldValues } from 'react-hook-form';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNoobFormContext } from '../../NoobFormContext';
import { LayerWrapper } from '../../../layers';

interface Props {
  definition: LayerSelectorDefinition<FieldValues>;
}

export function LayerSelector(props: Props) {
  const { definition } = props;
  const { map } = definition;
  const { register, getValues, setValue } = useNoobFormContext();
  const [layers, setLayers] = useState<LayerWrapper[]>([]);

  // Update select each time layers change
  useEffect(() => {
    const updateLayers = () => setLayers(map.getLayers());
    map.addLayerChangeListener(updateLayers);

    updateLayers();
    return () => map.removeLayerChangeListener(updateLayers);
  }, [map, definition.name, getValues, setValue]);

  // Each time layers are updated, we must try to set the current value
  useEffect(() => setValue(definition.name, getValues(definition.name)), [definition.name, getValues, setValue, layers]);

  return (
    <div className={Cls.field}>
      <div className={Cls.label}>{definition.label}</div>

      <select {...register(definition.name, definition.registerOptions)} className={'form-select'} data-testid={definition.name}>
        {/* Empty option is needed for the first display or undefined values */}
        <option></option>
        {layers.map((layer) => (
          <option key={layer.getId()} value={layer.getId()}>
            {layer.getName()}
          </option>
        ))}
      </select>
    </div>
  );
}
