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
import { AbcLegendItem } from '@abc-map/shared';
import { nanoid } from 'nanoid';
import Cls from './NewLegendItemForm.module.scss';

interface Props {
  onSubmit: (i: AbcLegendItem) => void;
}

interface State {
  text: string;
}

class NewLegendItemForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { text: '' };
  }

  public render(): ReactNode {
    const text = this.state.text;

    return (
      <div className={'my-4'}>
        <div className={'mb-2'}>Ajouter une entrée:</div>
        <div className={Cls.form}>
          <input type={'text'} value={text} onChange={this.handleTextChange} className={`form-control ${Cls.textField}`} />
          <button onClick={this.handleSubmit} className={'btn btn-primary ml-2'}>
            <i className={'fa fa-plus'} />
          </button>
        </div>
      </div>
    );
  }

  private handleTextChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const text = ev.target.value;
    this.setState({ text });
  };

  private handleSubmit = () => {
    const item: AbcLegendItem = {
      id: nanoid(),
      text: this.state.text,
    };

    this.props.onSubmit(item);
    this.setState({ text: '' });
  };
}

export default NewLegendItemForm;
