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

import type { ChangeEvent } from 'react';
import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import type { Algorithm, GradientAlgorithm } from '../../../core/modules/Algorithm';
import { ClassificationAlgorithm, isClassificationAlgorithm, isGradientAlgorithm, isScaleAlgorithm, ScaleAlgorithm } from '../../../core/modules/Algorithm';
import AlgorithmSelector from '../../../components/algorithm-selector/AlgorithmSelector';
import FormLine from '../../../components/form-line/FormLine';
import { ScaleColors } from './ScaleColors';
import type { ClassesConfig } from './ClassificationColors';
import { ClassificationColors } from './ClassificationColors';
import type { DataSource } from '../../../core/data/data-source/DataSource';
import type { GradientClass } from '../typings/GradientClass';
import { ColorGradientTips } from '../../../core/tips';
import type { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import type { ServiceProps } from '../../../core/withServices.tsx';
import { withServices } from '../../../core/withServices.tsx';

const logger = Logger.get('GradientsConfigForm.tsx');

export interface ColorsConfigFormValues {
  layerName: string;
  start: string;
  end: string;
  algorithm: GradientAlgorithm;
  classes: GradientClass[];
}

interface Props extends ServiceProps, WithTranslation {
  values: ColorsConfigFormValues;
  valueField: string;
  dataSource: DataSource;
  onChange: (config: ColorsConfigFormValues) => void;
}

const algorithms: Algorithm[] = [ScaleAlgorithm.Interpolated, ...Object.values(ClassificationAlgorithm)];

export const GradientsConfigForm = withTranslation()(
  withServices(
    class GradientsConfigForm extends Component<Props, unknown> {
      public render() {
        const t = this.props.i18n.getFixedT(this.props.i18n.language, 'ColorGradientsModule');
        const values = this.props.values;
        const dataSource = this.props.dataSource;
        const valueField = this.props.valueField;
        const currentAlgo = this.props.values.algorithm;

        return (
          <>
            <FormLine>
              <label htmlFor="layer-name" className={'flex-grow-1'}>
                {t('Name_of_new_layer')}:
              </label>
              <input type={'text'} className={'form-control'} id={'layer-name'} value={values?.layerName} onChange={this.handleLayerNameChange} />
            </FormLine>

            <FormLine>
              <AlgorithmSelector
                label={`${t('Scale_or_classification')}:`}
                tip={ColorGradientTips.Algorithm}
                only={algorithms}
                value={values.algorithm}
                onChange={this.handleAlgorithmChange}
              />
            </FormLine>

            {isScaleAlgorithm(currentAlgo) && <ScaleColors start={values.start} end={values.end} onChange={this.handleScaleColorsChanged} />}
            {isClassificationAlgorithm(currentAlgo) && (
              <ClassificationColors
                value={{ classes: values.classes, startColor: values.start, endColor: values.end }}
                dataSource={dataSource}
                valueField={valueField}
                algorithm={currentAlgo}
                onChange={this.handleColorConfigChanged}
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

      private handleColorConfigChanged = (classes: ClassesConfig) => {
        const config: ColorsConfigFormValues = {
          ...this.props.values,
          classes: classes.classes,
          start: classes.startColor,
          end: classes.endColor,
        };
        this.props.onChange(config);
      };
    },
  ),
);
