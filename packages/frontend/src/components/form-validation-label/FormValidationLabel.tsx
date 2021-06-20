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
}

class FormValidationLabel extends Component<Props, {}> {
  public render(): ReactNode {
    const formState = this.props.state;

    switch (formState) {
      case FormState.Ok:
        return <MessageLabel icon={'fa-rocket'} message={'Tout est bon !'} />;

      case FormState.InvalidEmail:
        return <MessageLabel icon={'fa-exclamation-circle'} message={"L'adresse email n'est pas valide."} />;

      case FormState.InvalidPassword:
        return <MessageLabel icon={'fa-exclamation-circle'} message={"Le mot de passe n'est pas valide."} />;

      case FormState.PasswordTooWeak:
        return (
          <MessageLabel
            icon={'fa-exclamation-circle'}
            message={'Le mot de passe doit contenir 6 caractères minimum, une majuscule, un chiffre ou un symbole.'}
          />
        );

      case FormState.PasswordNotConfirmed:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'Le mot de passe et la confirmation de mot de passe ne correspondent pas.'} />;

      case FormState.PasswordEqualEmail:
        return <MessageLabel icon={'fa-laugh-wink'} message={"Le mot de passe et l'email doivent être différents !"} />;

      case FormState.DeletionNotConfirmed:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'Vous devez confirmer la suppression de votre compte.'} />;

      case FormState.InvalidUrl:
        return (
          <MessageLabel icon={'fa-exclamation-circle'}>
            L&apos;URL doit être valide et commencer par <code>http://</code> ou <code>https://</code>.
          </MessageLabel>
        );

      case FormState.MissingRemoteLayer:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La couche distante est obligatoire.'} />;

      case FormState.MissingNewLayerName:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'Le nom de la couche est obligatoire.'} />;

      case FormState.MissingDataSource:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La source de données est obligatoire.'} />;

      case FormState.MissingDataJoinBy:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'Le champ de jointure des données est obligatoire.'} />;

      case FormState.MissingAlgorithm:
        return <MessageLabel icon={'fa-exclamation-circle'} message={"L'algorithme est obligatoire."} />;

      case FormState.MissingColorValueField:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'Le champ couleur est obligatoire.'} />;

      case FormState.MissingSymbolValueField:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'Le champ de taille de symbole est obligatoire.'} />;

      case FormState.MissingSizeMin:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La taille minimale est obligatoire.'} />;

      case FormState.MissingSizeMax:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La taille maximale est obligatoire.'} />;

      case FormState.InvalidSizeMinMax:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La taille minimale doit être supérieure à la taille maximale.'} />;

      case FormState.MissingSymbolType:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'Le type de symbole est obligatoire.'} />;

      case FormState.MissingGeometryLayer:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La couche de géométrie est obligatoire.'} />;

      case FormState.MissingStartColor:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La couleur de début est obligatoire.'} />;

      case FormState.MissingEndColor:
        return <MessageLabel icon={'fa-exclamation-circle'} message={'La couleur de fin est obligatoire.'} />;

      default:
        return (
          <MessageLabel icon={'fa-exclamation-circle'}>
            {(() => {
              logger.error(`Unhandled state: ${formState}`);
              return <>Formulaire invalide, mais impossible de vous dire pourquoi 😭</>;
            })()}
          </MessageLabel>
        );
    }
  }
}

export default FormValidationLabel;
