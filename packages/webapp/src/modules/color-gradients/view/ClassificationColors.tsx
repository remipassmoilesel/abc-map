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

import React, { ChangeEvent, Component } from 'react';
import { Logger } from '@abc-map/shared';
import FormLine from '../../../components/form-line/FormLine';
import { DataSource } from '../../../core/data/data-source/DataSource';
import { GradientClass } from '../typings/GradientClass';
import { ServiceProps, withServices } from '../../../core/withServices';
import { Stats } from '../../../core/modules/Stats';
import { ClassificationAlgorithm } from '../../../core/modules/Algorithm';
import range from 'lodash/range';
import * as chroma from 'chroma-js';
import { nanoid } from 'nanoid';
import ClassRow from './class-row/ClassRow';
import ColorPicker from '../../../components/color-picker/ColorPickerButton';
import { asValidNumber, isValidNumber } from '../../../core/utils/numbers';
import { prefixedTranslation } from '../../../i18n/i18n';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';

const logger = Logger.get('ColorScaleSelection.tsx');

interface Props extends ServiceProps {
  value: ClassesConfig;
  dataSource: DataSource;
  valueField: string;
  algorithm: ClassificationAlgorithm;
  onChange: (change: ClassesConfig) => void;
}

export interface ClassesConfig {
  classes: GradientClass[];
  startColor: string;
  endColor: string;
}

interface State {
  numberOfClasses: number;
}

const t = prefixedTranslation('ColorGradientsModule:');

class ClassificationColors extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { numberOfClasses: props.value.classes.length || 5 };
  }

  public render() {
    const numberOfClasses = this.state.numberOfClasses;
    const classes = this.props.value.classes;
    const startColor = this.props.value.startColor;
    const endColor = this.props.value.endColor;

    return (
      <>
        <FormLine>
          <div className={'flex-grow-1'}>{t('Start_color')}:</div>
          <ColorPicker value={startColor} onClose={this.handleStartChanged} />
        </FormLine>
        <FormLine>
          <div className={'flex-grow-1'}>{t('End_color')}:</div>
          <ColorPicker value={endColor} onClose={this.handleEndChanged} />
        </FormLine>
        <FormLine>
          <div className={'flex-grow-1'}>{t('Number_of_classes')}:</div>
          <select className={'form-select'} value={numberOfClasses} onChange={this.handleClassNumberChanged}>
            {range(3, 11).map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </FormLine>

        {classes.length && (
          <FormLine>
            <div className={'flex-grow-1'}>{t('Classes')}:</div>

            <div className={'d-flex flex-column'}>
              {classes.map((cl) => (
                <ClassRow key={cl.id} gradientClass={cl} onChange={this.handleClassChanged} />
              ))}
              <div>
                <button onClick={this.handleResetClasses} className={'btn btn-outline-secondary my-3'}>
                  <FaIcon icon={IconDefs.faUndo} className={'mr-2'} />
                  {t('Calculate_classes')}
                </button>
              </div>
            </div>
          </FormLine>
        )}
      </>
    );
  }

  public componentDidMount() {
    const { toasts } = this.props.services;

    this.computeClasses().catch((err) => {
      toasts.genericError();
      logger.error('Cannot preview classes: ', err);
    });
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const { toasts } = this.props.services;
    const dataSourceChanged = prevProps.dataSource.getId() !== this.props.dataSource.getId();
    const algorithmChanged = prevProps.algorithm !== this.props.algorithm;
    const numberOfClassesChanged = prevState.numberOfClasses !== this.state.numberOfClasses;
    const valueFieldChanged = prevProps.valueField !== this.props.valueField;
    const startChanged = prevProps.value.startColor !== this.props.value.startColor;
    const endChanged = prevProps.value.endColor !== this.props.value.endColor;

    if (dataSourceChanged || algorithmChanged || numberOfClassesChanged || valueFieldChanged || startChanged || endChanged) {
      this.computeClasses().catch((err) => {
        toasts.genericError();
        logger.error('Cannot preview classes: ', err);
      });
    }
  }

  private handleClassNumberChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(ev.target.value);
    this.setState({ numberOfClasses: value });
  };

  private handleClassChanged = (cl: GradientClass) => {
    const classes = this.props.value.classes.map((c) => (c.id === cl.id ? cl : c));

    this.props.onChange({ ...this.props.value, classes });
  };

  private handleStartChanged = (color: string) => {
    this.props.onChange({ ...this.props.value, startColor: color });
  };

  private handleEndChanged = (color: string) => {
    this.props.onChange({ ...this.props.value, endColor: color });
  };

  private handleResetClasses = () => {
    const startColor = this.props.value.startColor;
    const endColor = this.props.value.endColor;
    const numberOfClasses = this.state.numberOfClasses;
    const classes = this.props.value.classes;

    const colorFunc = chroma.scale([startColor, endColor]).domain([0, numberOfClasses]).classes(numberOfClasses);
    const newClasses = classes.map((cl, i) => ({
      ...cl,
      id: nanoid(),
      color: colorFunc(i).hex(),
    }));

    this.props.onChange({ ...this.props.value, classes: newClasses });
  };

  private async computeClasses() {
    const startColor = this.props.value.startColor;
    const endColor = this.props.value.endColor;
    const dataSource = this.props.dataSource;
    const algo = this.props.algorithm;
    const valueField = this.props.valueField;
    const numberOfClasses = this.state.numberOfClasses;

    const colorFunc = chroma.scale([startColor, endColor]).domain([0, numberOfClasses]).classes(numberOfClasses);
    const rows = await dataSource.getRows();
    const data = rows.map((row) => asValidNumber(row.data[valueField])).filter(isValidNumber);
    const classes = Stats.classify(algo, numberOfClasses, data).map((cl, i) => {
      return { ...cl, id: nanoid(), color: colorFunc(i).hex() };
    });

    this.props.onChange({ ...this.props.value, classes });
  }
}

export default withServices(ClassificationColors);
