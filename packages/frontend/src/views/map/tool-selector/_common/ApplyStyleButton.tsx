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
import React, { Component, ReactNode } from 'react';

interface Props {
  onClick: () => void;
}

class ApplyStyleButton extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={'d-flex justify-content-center mb-3'}>
        <button
          onClick={this.props.onClick}
          title={'Cliquez pour appliquer le style courant aux géométries sélectionnées'}
          className={'btn btn-sm btn-outline-primary mt-3'}
        >
          Appliquer le style
        </button>
      </div>
    );
  }
}

export default ApplyStyleButton;
