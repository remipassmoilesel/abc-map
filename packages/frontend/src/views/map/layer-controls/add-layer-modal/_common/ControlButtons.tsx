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

import React from 'react';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

interface Props {
  submitDisabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const t = prefixedTranslation('MapView:');

class ControlButtons extends React.Component<Props, {}> {
  public render() {
    const onCancel = this.props.onCancel;
    const onConfirm = this.props.onConfirm;
    const submitDisabled = this.props.submitDisabled;
    return (
      <div className={'d-flex justify-content-end mt-3'}>
        <button className={'btn btn-secondary mr-3'} onClick={onCancel} data-testid={'cancel'}>
          {t('Cancel')}
        </button>
        <button disabled={submitDisabled} className={'btn btn-primary'} onClick={onConfirm} data-testid={'confirm'} data-cy={'add-layer-confirm'}>
          {t('Add_layer')}
        </button>
      </div>
    );
  }
}

export default withTranslation()(ControlButtons);
