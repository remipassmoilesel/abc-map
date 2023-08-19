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
import { Algorithm, allAlgorithms, LabeledAlgorithms } from '../../core/modules/Algorithm';
import DialogBoxAdvice from '../dialog-box-advice/DialogBoxAdvice';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  label: string;
  tip: string;
  only?: Algorithm[];
  value: Algorithm | undefined;
  onChange: (value: Algorithm) => void;
}

class AlgorithmSelector extends Component<Props, {}> {
  public render() {
    const { value, label, tip, only, t } = this.props;

    return (
      <>
        <label htmlFor="algorithm" className={'flex-grow-1'}>
          {label}
        </label>
        <DialogBoxAdvice id={tip} />
        <select value={value} onChange={this.handleAlgorithmChange} className={'form-select'} id={'algorithm'}>
          <option value={undefined}>{t('Choose_algorithm')}</option>
          {(only ?? allAlgorithms()).map((algo) => {
            const labeled = LabeledAlgorithms.All.find((lbl) => lbl.value === algo);
            const label = t(labeled?.i18nLabel || 'Invalid_option');
            return (
              <option value={algo} key={algo}>
                {label}
              </option>
            );
          })}
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

export default withTranslation('AlgorithmSelector')(AlgorithmSelector);
