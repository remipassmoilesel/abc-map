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

import React, { ChangeEvent, Component } from 'react';
import { Logger } from '@abc-map/shared';
import { Algorithm, isScaleAlgorithm, ScaleAlgorithm } from '../../../../core/modules/Algorithm';
import AlgorithmSelector from '../../../../components/algorithm-selector/AlgorithmSelector';
import FormLine from '../../../../components/form-line/FormLine';
import { ProportionalSymbolsTips } from '@abc-map/user-documentation';
import PointIconPicker from '../../../../components/icon-picker/PointIconPicker';
import ColorPicker from '../../../../components/color-picker/ColorPickerButton';
import { IconName } from '../../../../assets/point-icons/IconName';
import { prefixedTranslation } from '../../../../i18n/i18n';

const logger = Logger.get('SymbolConfigForm.tsx');

export interface SymbolConfigFormValues {
  layerName: string;
  type: IconName;
  color: string;
  sizeMin: number;
  sizeMax: number;
  algorithm: ScaleAlgorithm;
}

interface Props {
  values: SymbolConfigFormValues;
  onChange: (config: SymbolConfigFormValues) => void;
}

const algorithms = Object.values(ScaleAlgorithm);

const t = prefixedTranslation('ProportionalSymbolsModule:');

class SymbolConfigForm extends Component<Props, {}> {
  public render() {
    const values = this.props.values;

    return (
      <>
        <FormLine>
          <label htmlFor="layer-name" className={'flex-grow-1'}>
            {t('Name_of_new_layer')}:
          </label>
          <input type={'text'} className={'form-control'} id={'layer-name'} value={values?.layerName} onChange={this.handleLayerNameChange} />
        </FormLine>

        <FormLine>
          <label htmlFor="symbol" className={'flex-grow-1'}>
            {t('Symbol_type')}:
          </label>
          <PointIconPicker value={values.type} onChange={this.handleTypeChange} />
        </FormLine>

        <FormLine>
          <label htmlFor="symbol" className={'flex-grow-1'}>
            {t('Color')}:
          </label>
          <ColorPicker value={values.color} onClose={this.handleColorChange} />
        </FormLine>

        <FormLine>
          <label htmlFor="min-size" className={'flex-grow-1'}>
            {t('Minimal_size')}:
          </label>
          <input type={'number'} value={values?.sizeMin} onChange={this.handleSizeMinChange} min={1} className={'form-control'} id={'min-size'} />
        </FormLine>

        <FormLine>
          <label htmlFor="max-size" className={'flex-grow-1'}>
            {t('Maximal_size')}:
          </label>
          <input type={'number'} value={values?.sizeMax} onChange={this.handleSizeMaxChange} min={1} className={'form-control'} id={'max-size'} />
        </FormLine>

        <FormLine>
          <AlgorithmSelector
            label={t('Symbol_scale')}
            value={values.algorithm}
            tip={ProportionalSymbolsTips.Algorithm}
            only={algorithms}
            onChange={this.handleAlgorithmChange}
          />
        </FormLine>
      </>
    );
  }

  private handleLayerNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const config: SymbolConfigFormValues = {
      ...this.props.values,
      layerName: ev.target.value,
    };
    this.props.onChange(config);
  };

  private handleTypeChange = (type: IconName) => {
    const config: SymbolConfigFormValues = {
      ...this.props.values,
      type,
    };
    this.props.onChange(config);
  };

  private handleColorChange = (color: string) => {
    const config: SymbolConfigFormValues = {
      ...this.props.values,
      color,
    };
    this.props.onChange(config);
  };

  private handleSizeMinChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const config: SymbolConfigFormValues = {
      ...this.props.values,
      sizeMin: parseFloat(ev.target.value),
    };
    this.props.onChange(config);
  };

  private handleSizeMaxChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const config: SymbolConfigFormValues = {
      ...this.props.values,
      sizeMax: parseFloat(ev.target.value),
    };
    this.props.onChange(config);
  };

  private handleAlgorithmChange = (value: Algorithm) => {
    if (!isScaleAlgorithm(value)) {
      logger.error('Invalid value: ', value);
      return;
    }

    const config: SymbolConfigFormValues = {
      ...this.props.values,
      algorithm: value,
    };
    this.props.onChange(config);
  };
}

export default SymbolConfigForm;
