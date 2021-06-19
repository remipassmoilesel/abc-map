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
import { Algorithm, allAlgorithms, LabeledAlgorithms } from './Algorithm';
import TipBubble from '../../../components/tip-bubble/TipBubble';

interface Props {
  label: string;
  tip: string;
  only?: Algorithm[];
  value: Algorithm | undefined;
  onChange: (value: Algorithm) => void;
}

class AlgorithmSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const value = this.props.value;
    const label = this.props.label;
    const tip = this.props.tip;
    const options = (this.props.only || allAlgorithms()).map((algo) => {
      const labeled = LabeledAlgorithms.All.find((lbl) => lbl.value === algo);
      const label = labeled?.label || 'Option invalide';
      return (
        <option value={algo} key={algo}>
          {label}
        </option>
      );
    });

    return (
      <>
        <label htmlFor="algorithm" className={'flex-grow-1'}>
          {label}
        </label>
        <TipBubble id={tip} />
        <select value={value} onChange={this.handleAlgorithmChange} className={'form-control'} id={'algorithm'}>
          <option value={undefined}>Veuillez choisir</option>
          {options}
        </select>
      </>
    );
  }

  private handleAlgorithmChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value as Algorithm | string;

    if (allAlgorithms().some((v) => v === value)) {
      this.props.onChange(value as Algorithm);
    }
  };
}

export default AlgorithmSelector;
