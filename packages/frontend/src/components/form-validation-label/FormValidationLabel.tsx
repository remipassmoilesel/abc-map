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
import { FormState } from './FormState';
import MessageLabel from '../message-label/MessageLabel';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('FormValidationLabel.tsx');

export interface Props {
  state: FormState;
  className?: string;
}

class FormValidationLabel extends Component<Props, {}> {
  public render(): ReactNode {
    const formState = this.props.state;
    const className = this.props.className;
    const { icon, message } = this.getIconAndMessage(formState);

    if (icon && message) {
      return (
        <MessageLabel icon={icon} className={className}>
          {message}
        </MessageLabel>
      );
    } else {
      return (
        <MessageLabel icon={'fa-exclamation-circle'} className={className}>
          {(() => {
            logger.error(`Unhandled state: ${formState}`, { icon, message });
            return <>Formulaire invalide, mais impossible de vous dire pourquoi 😭</>;
          })()}
        </MessageLabel>
      );
    }
  }

  private getIconAndMessage(formState: FormState): { icon: string; message: React.ReactNode } {
    let icon = '';
    let message: React.ReactNode = '';
    switch (formState) {
      case FormState.Ok:
        icon = 'fa-rocket';
        message = 'Tout est bon !';
        break;

      case FormState.InvalidEmail:
        icon = 'fa-exclamation-circle';
        message = "L'adresse email n'est pas valide.";
        break;

      case FormState.InvalidPassword:
        icon = 'fa-exclamation-circle';
        message = "Le mot de passe n'est pas valide.";
        break;

      case FormState.PasswordTooWeak:
        icon = 'fa-exclamation-circle';
        message = 'Le mot de passe doit contenir 6 caractères minimum, une majuscule, un chiffre ou un symbole.';
        break;

      case FormState.PasswordNotConfirmed:
        icon = 'fa-exclamation-circle';
        message = 'Le mot de passe et la confirmation de mot de passe ne correspondent pas.';
        break;

      case FormState.PasswordEqualEmail:
        icon = 'fa-laugh-wink';
        message = "Le mot de passe et l'email doivent être différents !";
        break;

      case FormState.DeletionNotConfirmed:
        icon = 'fa-exclamation-circle';
        message = 'Vous devez confirmer la suppression de votre compte.';
        break;

      case FormState.InvalidUrl:
        icon = 'fa-exclamation-circle';
        message = (
          <>
            L&apos;URL doit être valide et commencer par <code>http://</code> ou <code>https://</code>.
          </>
        );

        break;

      case FormState.MissingRemoteLayer:
        icon = 'fa-exclamation-circle';
        message = 'Listez les couches puis sélectionnez-en une.';
        break;

      case FormState.MissingNewLayerName:
        icon = 'fa-exclamation-circle';
        message = 'Le nom de la couche est obligatoire.';
        break;

      case FormState.MissingDataSource:
        icon = 'fa-exclamation-circle';
        message = 'La source de données est obligatoire.';
        break;

      case FormState.MissingDataJoinBy:
        icon = 'fa-exclamation-circle';
        message = 'Le champ de jointure des données est obligatoire.';
        break;

      case FormState.MissingGeometryJoinBy:
        icon = 'fa-exclamation-circle';
        message = 'Le champ de jointure des géométries est obligatoire.';
        break;

      case FormState.MissingAlgorithm:
        icon = 'fa-exclamation-circle';
        message = "L'algorithme est obligatoire.";
        break;

      case FormState.MissingColorValueField:
        icon = 'fa-exclamation-circle';
        message = 'Le champ couleur est obligatoire.';
        break;

      case FormState.MissingSymbolValueField:
        icon = 'fa-exclamation-circle';
        message = 'Le champ de taille de symbole est obligatoire.';
        break;

      case FormState.MissingSizeMin:
        icon = 'fa-exclamation-circle';
        message = 'La taille minimale est obligatoire.';
        break;

      case FormState.MissingSizeMax:
        icon = 'fa-exclamation-circle';
        message = 'La taille maximale est obligatoire.';
        break;

      case FormState.InvalidSizeMinMax:
        icon = 'fa-exclamation-circle';
        message = 'La taille minimale doit être supérieure à la taille maximale.';
        break;

      case FormState.MissingSymbolType:
        icon = 'fa-exclamation-circle';
        message = 'Le type de symbole est obligatoire.';
        break;

      case FormState.MissingGeometryLayer:
        icon = 'fa-exclamation-circle';
        message = 'La couche de géométrie est obligatoire.';
        break;

      case FormState.MissingStartColor:
        icon = 'fa-exclamation-circle';
        message = 'La couleur de début est obligatoire.';
        break;

      case FormState.MissingEndColor:
        icon = 'fa-exclamation-circle';
        message = 'La couleur de fin est obligatoire.';
        break;
    }

    return { icon, message };
  }
}

export default FormValidationLabel;
