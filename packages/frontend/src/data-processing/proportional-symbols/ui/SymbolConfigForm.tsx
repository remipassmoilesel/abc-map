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
import { Logger } from '@abc-map/frontend-commons';
import { PointType, ScaleAlgorithm } from '../Parameters';
import TipBubble from '../../../components/tip-bubble/TipBubble';
import { ProportionalSymbolsTips } from '@abc-map/user-documentation';

const logger = Logger.get('SymbolConfigForm.tsx');

export interface ConfigFormValues {
  layerName: string;
  type: PointType;
  sizeMin: number;
  sizeMax: number;
  algorithm: ScaleAlgorithm;
}

interface Props {
  values: ConfigFormValues;
  onChange: (config: ConfigFormValues) => void;
}

class SymbolConfigForm extends Component<Props, {}> {
  public render(): ReactNode {
    const value = this.props.values;

    return (
      <>
        <div className={'form-line'}>
          <label htmlFor="layer-name">Nom de la nouvelle couche</label>
          <input type={'text'} className={'form-control'} id={'layer-name'} value={value?.layerName} onChange={this.handleLayerNameChange} />
        </div>

        <div className={'form-line'}>
          <label htmlFor="symbol">Type de symbole</label>
          <select className={'form-control'} id={'symbol'} value={value?.type} onChange={this.handleTypeChange}>
            <option value={PointType.Circle}>Rond</option>
          </select>
        </div>

        <div className={'form-line'}>
          <label htmlFor="min-size">Taille minimale</label>
          <input type={'number'} value={value?.sizeMin} onChange={this.handleSizeMinChange} min={1} className={'form-control'} id={'min-size'} />
        </div>

        <div className={'form-line'}>
          <label htmlFor="max-size">Taille maximale</label>
          <input type={'number'} value={value?.sizeMax} onChange={this.handleSizeMaxChange} min={1} className={'form-control'} id={'max-size'} />
        </div>

        <div className={'form-line'}>
          <label htmlFor="algorithm">Échelle des symboles</label>
          <select value={value.algorithm} onChange={this.handleAlgorithmChange} className={'form-control'} id={'algorithm'}>
            <option value={ScaleAlgorithm.Absolute}>Absolue</option>
            <option value={ScaleAlgorithm.Interpolated}>Interpolée</option>
          </select>
          <TipBubble id={ProportionalSymbolsTips.Algorithm} />
        </div>
      </>
    );
  }

  private handleLayerNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const config: ConfigFormValues = {
      ...this.props.values,
      layerName: ev.target.value,
    };
    this.props.onChange(config);
  };

  private handleTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const config: ConfigFormValues = {
      ...this.props.values,
      type: ev.target.value as PointType,
    };
    this.props.onChange(config);
  };

  private handleSizeMinChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const config: ConfigFormValues = {
      ...this.props.values,
      sizeMin: parseFloat(ev.target.value),
    };
    this.props.onChange(config);
  };

  private handleSizeMaxChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const config: ConfigFormValues = {
      ...this.props.values,
      sizeMax: parseFloat(ev.target.value),
    };
    this.props.onChange(config);
  };

  private handleAlgorithmChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const config: ConfigFormValues = {
      ...this.props.values,
      algorithm: ev.target.value as ScaleAlgorithm,
    };
    this.props.onChange(config);
  };
}

export default SymbolConfigForm;
