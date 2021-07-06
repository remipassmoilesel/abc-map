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
import FormLine from '../../_common/form-line/FormLine';
import { DataSource } from '../../../core/data/data-source/DataSource';
import { GradientClass } from '../GradientClass';
import { ServiceProps, withServices } from '../../../core/withServices';
import { Stats } from '../../_common/stats/Stats';
import { ClassificationAlgorithm } from '../../_common/algorithm/Algorithm';
import * as _ from 'lodash';
import * as chroma from 'chroma-js';
import { nanoid } from 'nanoid';
import ClassRow from './ClassRow';

const logger = Logger.get('ColorScaleSelection.tsx');

interface Props extends ServiceProps {
  values: GradientClass[];
  dataSource: DataSource;
  valueField: string;
  algorithm: ClassificationAlgorithm;
  onChange: (classes: GradientClass[]) => void;
}

interface State {
  numberOfClasses: number;
}

const defaultStartColor = '#fee0d1';
const defaultEndColor = '#99390f';

class ClassificationColors extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { numberOfClasses: props.values.length || 5 };
  }

  public render(): ReactNode {
    const numberOfClasses = this.state.numberOfClasses;
    const classes = this.props.values;

    return (
      <>
        <FormLine>
          <div className={'flex-grow-1'}>Nombre de classes:</div>
          <select className={'form-control'} value={numberOfClasses} onChange={this.handleClassNumberChanged}>
            {_.range(3, 16).map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </FormLine>

        {classes.length && (
          <FormLine>
            <div className={'flex-grow-1'}>Classes:</div>

            <div className={'d-flex flex-column'}>
              {classes.map((cl) => (
                <ClassRow key={cl.id} gradientClass={cl} onChange={this.handleClassChanged} />
              ))}
              <div>
                <button onClick={this.handleResetClasses} className={'btn btn-outline-secondary my-3'}>
                  <i className={'fa fa-undo mr-2'} />
                  Couleurs par défaut
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

    if (dataSourceChanged || algorithmChanged || numberOfClassesChanged || valueFieldChanged) {
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
    const classes = this.props.values.map((c) => (c.id === cl.id ? cl : c));
    this.props.onChange(classes);
  };

  private handleResetClasses = () => {
    const numberOfClasses = this.state.numberOfClasses;
    const classes = this.props.values;
    const colorFunc = chroma.scale([defaultStartColor, defaultEndColor]).domain([0, numberOfClasses]).classes(numberOfClasses);
    const newClasses = classes.map((cl, i) => ({
      ...cl,
      id: nanoid(),
      color: colorFunc(i).hex(),
    }));

    this.props.onChange(newClasses);
  };

  private async computeClasses() {
    const dataSource = this.props.dataSource;
    const algo = this.props.algorithm;
    const valueField = this.props.valueField;
    const numberOfClasses = this.state.numberOfClasses;
    const previousClasses = this.props.values;

    const colorFunc = chroma.scale([defaultStartColor, defaultEndColor]).domain([0, numberOfClasses]).classes(numberOfClasses);
    const rows = await dataSource.getRows();
    const data = rows.map((row) => row[valueField]).filter((v) => typeof v === 'number') as number[];
    const classes = Stats.classify(algo, numberOfClasses, data).map((cl, i) => {
      const color = previousClasses[i] && previousClasses[i].color !== colorFunc(i).hex() ? previousClasses[i].color : colorFunc(i).hex();
      return {
        ...cl,
        id: nanoid(),
        color,
      };
    });

    this.props.onChange(classes);
  }
}

export default withServices(ClassificationColors);
