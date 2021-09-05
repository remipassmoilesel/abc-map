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
import { Logger } from '@abc-map/shared';

const logger = Logger.get('RegistrationDone.tsx');

interface Props {
  onConfirm: () => void;
}

class RegistrationDone extends Component<Props> {
  public render(): ReactNode {
    const handleConfirm = this.props.onConfirm;

    return (
      <>
        {/* Intro */}

        <div className={'mb-3'}>
          <b>Plus qu&apos;une étape 🙌</b>
        </div>
        <p className={'mb-3'}>Un email vous a été envoyé, il contient un lien pour activer votre compte.</p>
        <p className={'mb-3'}>Pensez à vérifier vos spam 📧 !</p>

        {/* Confirmation button */}

        <div className={'d-flex justify-content-end'}>
          <button
            data-testid={'confirm-registration'}
            data-cy={'confirm-registration'}
            type={'button'}
            onClick={handleConfirm}
            className={'btn btn-primary ml-2'}
          >
            Ok !
          </button>
        </div>
      </>
    );
  }
}

export default RegistrationDone;
