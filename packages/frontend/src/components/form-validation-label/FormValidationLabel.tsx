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
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IconDefs } from '../icon/IconDefs';

const logger = Logger.get('FormValidationLabel.tsx');

export interface Props {
  state: FormState;
  className?: string;
}

const t = prefixedTranslation('FormValidationLabel:');

class FormValidationLabel extends Component<Props, {}> {
  public render(): ReactNode {
    const formState = this.props.state;
    const className = this.props.className;
    const { icon, message } = this.getIconAndMessage(formState);

    if (icon && message) {
      return (
        <MessageLabel icon={icon} className={className} data-testid={'form-validation'}>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </MessageLabel>
      );
    } else {
      return (
        <MessageLabel icon={IconDefs.faExclamationCircle} className={className} data-testid={'form-validation'}>
          {(() => {
            logger.error(`Unhandled state: ${formState}`, { icon, message });
            return <>{t('Invalid_form')}</>;
          })()}
        </MessageLabel>
      );
    }
  }

  private getIconAndMessage(formState: FormState): { icon: IconDefinition; message: string } {
    let icon = IconDefs.faExclamationCircle;
    let message = '';
    switch (formState) {
      case FormState.Ok:
        icon = IconDefs.faRocket;
        message = t('Perfect');
        break;

      case FormState.InvalidEmail:
        icon = IconDefs.faExclamationCircle;
        message = t('Invalid_email');
        break;

      case FormState.InvalidPassword:
        icon = IconDefs.faExclamationCircle;
        message = t('Invalid_password');
        break;

      case FormState.IncorrectPassword:
        icon = IconDefs.faExclamationCircle;
        message = t('Incorrect_password');
        break;

      case FormState.PasswordTooWeak:
        icon = IconDefs.faExclamationCircle;
        message = t('Password_is_weak');
        break;

      case FormState.PasswordNotConfirmed:
        icon = IconDefs.faExclamationCircle;
        message = t('Password_and_confirmation_do_not_match');
        break;

      case FormState.PasswordEqualEmail:
        icon = IconDefs.faLaughWink;
        message = t('Password_and_email_must_be_different');
        break;

      case FormState.DeletionNotConfirmed:
        icon = IconDefs.faExclamationCircle;
        message = t('You_must_confirm_account_deletion');
        break;

      case FormState.InvalidHttpsUrl:
        icon = IconDefs.faExclamationCircle;
        message = t('Invalid_https_URL');
        break;

      case FormState.InvalidUrl:
        icon = IconDefs.faExclamationCircle;
        message = t('Invalid_URL');
        break;

      case FormState.MissingXYZPlaceHolders:
        icon = IconDefs.faExclamationCircle;
        message = t('Missing_xyz_placeholders');
        break;

      case FormState.MissingRemoteLayer:
        icon = IconDefs.faExclamationCircle;
        message = t('List_layers_then_select_one');
        break;

      case FormState.MissingNewLayerName:
        icon = IconDefs.faExclamationCircle;
        message = t('The_name_of_the_layer_is_mandatory');
        break;

      case FormState.MissingDataSource:
        icon = IconDefs.faExclamationCircle;
        message = t('Data_source_is_mandatory');
        break;

      case FormState.MissingDataJoinBy:
        icon = IconDefs.faExclamationCircle;
        message = t('Join_data_field_is_mandatory');
        break;

      case FormState.MissingGeometryJoinBy:
        icon = IconDefs.faExclamationCircle;
        message = t('Join_geometry_field_is_mandatory');
        break;

      case FormState.MissingAlgorithm:
        icon = IconDefs.faExclamationCircle;
        message = t('Algorithm_is_mandatory');
        break;

      case FormState.MissingColorValueField:
        icon = IconDefs.faExclamationCircle;
        message = t('Color_field_is_mandatory');
        break;

      case FormState.MissingSymbolValueField:
        icon = IconDefs.faExclamationCircle;
        message = t('Size_field_is_mandatory');
        break;

      case FormState.MissingSizeMin:
        icon = IconDefs.faExclamationCircle;
        message = t('Min_size_is_mandatory');
        break;

      case FormState.MissingSizeMax:
        icon = IconDefs.faExclamationCircle;
        message = t('Max_size_is_mandatory');
        break;

      case FormState.InvalidSizeMinMax:
        icon = IconDefs.faExclamationCircle;
        message = t('Max_must_be_greater_than_min');
        break;

      case FormState.MissingSymbolType:
        icon = IconDefs.faExclamationCircle;
        message = t('Symbol_type_is_mandatory');
        break;

      case FormState.MissingGeometryLayer:
        icon = IconDefs.faExclamationCircle;
        message = t('Geometry_layer_is_mandatory');
        break;

      case FormState.MissingStartColor:
        icon = IconDefs.faExclamationCircle;
        message = t('Start_color_mandatory');
        break;

      case FormState.MissingEndColor:
        icon = IconDefs.faExclamationCircle;
        message = t('End_color_mandatory');
        break;

      case FormState.FieldMissing:
        icon = IconDefs.faExclamationCircle;
        message = t('Missing_fields');
        break;

      case FormState.InvalidFile:
        icon = IconDefs.faExclamationCircle;
        message = t('Invalid_file');
        break;

      case FormState.FileTooHeavy:
        icon = IconDefs.faExclamationCircle;
        message = t('File_too_heavy');
        break;

      case FormState.InvalidLinkText:
        icon = IconDefs.faExclamationCircle;
        message = t('Invalid_link_text');
        break;
    }

    return { icon, message };
  }
}

export default withTranslation()(FormValidationLabel);
