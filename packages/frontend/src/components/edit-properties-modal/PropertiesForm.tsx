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
import { SimplePropertiesMap } from '../../core/geo/features/FeatureWrapper';
import { asNumberOrString } from '../../core/utils/numbers';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './PropertiesForm.module.scss';
import { nanoid } from 'nanoid';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';

// TODO: unit test

const logger = Logger.get('PropertiesForm.tsx');

interface Props extends ServiceProps {
  properties: SimplePropertiesMap;
  onChange: (value: SimplePropertiesMap) => void;
  onNewPropertiesChange: (value: SimplePropertiesMap) => void;
}

interface State {
  newProperties: NewProperty[];
}

interface NewProperty {
  id: string;
  name: string;
  value: string;
}

const t = prefixedTranslation('EditPropertiesModal:');

class PropertiesForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { newProperties: [{ id: nanoid(), name: '', value: '' }] };
  }

  public render(): ReactNode {
    const properties = this.props.properties;
    const newProperties = this.state.newProperties;

    const rows = Object.keys(properties).map((property) => {
      const value = properties[property];
      if (typeof value !== 'string' && typeof value !== 'number') {
        return (
          <tr key={property}>
            <td>Propriété invalide</td>
          </tr>
        );
      }

      return (
        <tr key={property}>
          <td className={Cls.label} data-cy={'property-name'}>
            {property}
          </td>
          <td className={Cls.value}>
            <input
              type={'text'}
              value={value}
              onChange={(ev) => this.handlePropertyChange(property, ev)}
              data-cy={'property-value'}
              className={'form-control'}
            />
            <button
              onClick={() => this.handleDeleteProperty(property)}
              className={'ml-2 btn btn-link btn-sm'}
              title={t('Delete_property')}
              data-cy={`delete-property-button-${property}`}
            >
              <FaIcon icon={IconDefs.faTrash} />
            </button>
          </td>
        </tr>
      );
    });

    const newPropertyRows = newProperties.map((property, i) => {
      const isLast = i === newProperties.length - 1;
      const key = `${property.id}`;
      return (
        <tr className={'mt-2'} key={key}>
          <td className={Cls.label}>
            <input
              placeholder={'Nom'}
              value={property.name}
              onChange={(ev) => this.handleNewNameChange(property.id, ev)}
              className={'form-control'}
              data-cy={`new-name-${property.name || 'unknown'}`}
            />
          </td>
          <td className={Cls.value}>
            <input
              placeholder={t('Value')}
              value={property.value}
              onChange={(ev) => this.handleNewValueChange(property.id, ev)}
              className={'form-control'}
              data-cy={`new-value-${property.name || 'unknown'}`}
            />
            <button
              onClick={() => this.handleDeleteNewProperty(property.id)}
              title={t('Delete_property')}
              className={'ml-2 btn btn-link btn-sm'}
              data-cy={`delete-button-${property.name || 'unknown'}`}
            >
              <FaIcon icon={IconDefs.faTrash} />
            </button>
            {isLast && (
              <button
                onClick={this.handleNewPropertyField}
                className={`btn btn-link btn-sm ${Cls.buttonNew}`}
                title={t('New_property')}
                data-cy={'new-property-button'}
              >
                <FaIcon icon={IconDefs.faPlus} size={'1.2rem'} />
              </button>
            )}
          </td>
        </tr>
      );
    });

    return (
      <table className={Cls.form}>
        <tbody>
          {rows}
          {newPropertyRows}
        </tbody>
      </table>
    );
  }

  private handlePropertyChange(property: string, ev: ChangeEvent<HTMLInputElement>): void {
    const res: SimplePropertiesMap = {
      ...this.props.properties,
      [property]: asNumberOrString(ev.target.value.trim()),
    };

    this.props.onChange(res);
  }

  private handleDeleteProperty = (property: string) => {
    const res: SimplePropertiesMap = {
      ...this.props.properties,
    };

    delete res[property];

    this.props.onChange(res);
  };

  private handleNewNameChange = (propertyId: string, ev: ChangeEvent<HTMLInputElement>) => {
    const newProperties = this.state.newProperties.map((p) => {
      if (p.id === propertyId) {
        return { ...p, name: ev.target.value.trim() };
      }
      return p;
    });

    this.setState({ newProperties });
    this.dispatchNewPropertiesChange(newProperties);
  };

  private handleNewValueChange = (propertyId: string, ev: ChangeEvent<HTMLInputElement>) => {
    const newProperties = this.state.newProperties.map((p) => {
      if (p.id === propertyId) {
        return { ...p, value: ev.target.value.trim() };
      }
      return p;
    });

    this.setState({ newProperties });
    this.dispatchNewPropertiesChange(newProperties);
  };

  private handleDeleteNewProperty = (propertyId: string) => {
    const newProperties = this.state.newProperties.filter((p) => p.id !== propertyId);
    this.setState({ newProperties });
  };

  private handleNewPropertyField = () => {
    const newProperties = this.state.newProperties.slice();
    newProperties.push({ id: nanoid(), name: '', value: '' });
    this.setState({ newProperties });
  };

  private dispatchNewPropertiesChange(newProperties: NewProperty[]) {
    const res: SimplePropertiesMap = {};
    for (const newProp of newProperties) {
      if (newProp.name) {
        res[newProp.name] = newProp.value;
      }
    }

    this.props.onNewPropertiesChange(res);
  }
}

export default withTranslation()(withServices(PropertiesForm));
