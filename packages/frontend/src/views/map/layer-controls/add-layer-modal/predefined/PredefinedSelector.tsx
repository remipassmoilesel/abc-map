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

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger, PredefinedLayerModel } from '@abc-map/shared';
import { LabeledPredefinedModels } from './LabeledPredefinedModels';

const logger = Logger.get('PredefinedSelector.tsx');

interface Props {
  value: PredefinedLayerModel;
  onChange: (m: PredefinedLayerModel) => void;
}

class PredefinedSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const model = this.props.value;
    const labelledModel = LabeledPredefinedModels.find(model);
    return (
      <div className={'mb-3'}>
        <div className={'mb-2'}>Sélectionnez le type de fond de carte : </div>
        <div className={'form-group'}>
          <select value={model} onChange={this.handleChange} className={'form-control'} data-cy={'predefined-model'}>
            {LabeledPredefinedModels.All.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className={'mb-2'}>Aperçu : </div>
        <div className={'d-flex justify-content-center'}>
          <img src={labelledModel?.preview} width={440} alt={labelledModel?.label} className={'border'} />
        </div>
        <div className={'my-2'}>
          Origine des données et license:
          <div>
            <span dangerouslySetInnerHTML={{ __html: labelledModel?.by || '' }} />
            <span className={'ml-2'} dangerouslySetInnerHTML={{ __html: labelledModel?.license || '' }} />
          </div>
        </div>
      </div>
    );
  }

  private handleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value as PredefinedLayerModel;
    this.props.onChange(value);
  };
}

export default PredefinedSelector;
