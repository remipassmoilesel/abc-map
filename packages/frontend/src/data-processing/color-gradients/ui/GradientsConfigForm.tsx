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
import { Logger } from '@abc-map/shared';
import {
  Algorithm,
  ClassificationAlgorithm,
  GradientAlgorithm,
  isClassificationAlgorithm,
  isGradientAlgorithm,
  isScaleAlgorithm,
  ScaleAlgorithm,
} from '../../_common/algorithm/Algorithm';
import AlgorithmSelector from '../../_common/algorithm/AlgorithmSelector';
import FormLine from '../../_common/form-line/FormLine';
import ScaleColors from './ScaleColors';
import ClassificationColors from './ClassificationColors';
import { DataSource } from '../../../core/data/data-source/DataSource';
import { GradientClass } from '../GradientClass';
import { ColorGradientTips } from '@abc-map/user-documentation';

const logger = Logger.get('SymbolConfigForm.tsx');

export interface ColorsConfigFormValues {
  layerName: string;
  start: string;
  end: string;
  algorithm: GradientAlgorithm;
  classes: GradientClass[];
}

interface Props {
  values: ColorsConfigFormValues;
  valueField: string;
  dataSource: DataSource;
  onChange: (config: ColorsConfigFormValues) => void;
}

const algorithms: Algorithm[] = [ScaleAlgorithm.Interpolated, ...Object.values(ClassificationAlgorithm)];

class GradientsConfigForm extends Component<Props, {}> {
  public render(): ReactNode {
    const values = this.props.values;
    const dataSource = this.props.dataSource;
    const valueField = this.props.valueField;
    const currentAlgo = this.props.values.algorithm;

    return (
      <>
        <FormLine>
          <label htmlFor="layer-name" className={'flex-grow-1'}>
            Nom de la nouvelle couche:
          </label>
          <input type={'text'} className={'form-control'} id={'layer-name'} value={values?.layerName} onChange={this.handleLayerNameChange} />
        </FormLine>

        <FormLine>
          <AlgorithmSelector
            label={'Echelle ou classification:'}
            tip={ColorGradientTips.Algorithm}
            only={algorithms}
            value={values.algorithm}
            onChange={this.handleAlgorithmChange}
          />
        </FormLine>

        {isScaleAlgorithm(currentAlgo) && <ScaleColors start={values.start} end={values.end} onChange={this.handleScaleColorsChanged} />}
        {isClassificationAlgorithm(currentAlgo) && (
          <ClassificationColors
            values={values.classes}
            dataSource={dataSource}
            valueField={valueField}
            algorithm={currentAlgo}
            onChange={this.handleClassesChanged}
          />
        )}
      </>
    );
  }

  private handleLayerNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const config: ColorsConfigFormValues = {
      ...this.props.values,
      layerName: ev.target.value,
    };
    this.props.onChange(config);
  };

  private handleScaleColorsChanged = (start: string, end: string) => {
    const config: ColorsConfigFormValues = {
      ...this.props.values,
      start,
      end,
    };
    this.props.onChange(config);
  };

  private handleAlgorithmChange = (value: Algorithm) => {
    if (!isGradientAlgorithm(value)) {
      logger.error('Invalid algorithm');
      return;
    }

    const config: ColorsConfigFormValues = {
      ...this.props.values,
      algorithm: value,
    };
    this.props.onChange(config);
  };

  private handleClassesChanged = (classes: GradientClass[]) => {
    const config: ColorsConfigFormValues = {
      ...this.props.values,
      classes,
    };
    this.props.onChange(config);
  };
}

export default GradientsConfigForm;
