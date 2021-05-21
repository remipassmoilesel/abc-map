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
import Cls from './FormValidationLabel.module.scss';

export enum FormState {
  InvalidEmail = 'InvalidEmail',
  InvalidPassword = 'InvalidPassword',
  PasswordTooWeak = 'PasswordTooWeak',
  PasswordNotConfirmed = 'PasswordNotConfirmed',
  PasswordEqualEmail = 'PasswordEqualEmail',
  DeletionNotConfirmed = 'DeletionNotConfirmed',
  Ok = 'Ok',
}

export interface Props {
  state: FormState;
}

class FormValidationLabel extends Component<Props, {}> {
  public render(): ReactNode {
    const formState = this.props.state;

    return (
      <div className={Cls.validation}>
        {FormState.InvalidEmail === formState && (
          <>
            <i className={'fa fa-exclamation-circle'} /> L&apos;adresse email n&apos;est pas valide.
          </>
        )}
        {FormState.InvalidPassword === formState && (
          <>
            <i className={'fa fa-exclamation-circle'} /> Le mot de passe n&apos;est pas valide.
          </>
        )}
        {FormState.PasswordTooWeak === formState && (
          <>
            <i className={'fa fa-exclamation-circle'} /> Le mot de passe doit contenir 6 caractères minimum, une majuscule, un chiffre ou un symbole.
          </>
        )}
        {FormState.PasswordNotConfirmed === formState && (
          <>
            <i className={'fa fa-exclamation-circle'} /> Le mot de passe et la confirmation de mot de passe ne correspondent pas.
          </>
        )}
        {FormState.PasswordEqualEmail === formState && (
          <>
            <i className={'fa fa-exclamation-circle'} /> Le mot de passe et l&apos;email doivent être différents !
          </>
        )}
        {FormState.DeletionNotConfirmed === formState && (
          <>
            <i className={'fa fa-exclamation-circle'} /> Vous devez confirmer la suppression de votre compte.
          </>
        )}
        {FormState.Ok === formState && (
          <>
            <i className={'fa fa-rocket'} /> C&apos;est parti !
          </>
        )}
      </div>
    );
  }
}

export default FormValidationLabel;
