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

import Cls from './PropertiesForm.module.scss';
import React, { ChangeEvent, useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { useTranslation } from 'react-i18next';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { Property } from './Property';
import { nanoid } from 'nanoid';
import clsx from 'clsx';

const logger = Logger.get('PropertiesForm.tsx');

interface Props {
  properties: Property[];
  onChange: (values: Property[]) => void;
}

export function PropertiesForm(props: Props) {
  const { t } = useTranslation('EditPropertiesModal');
  const { properties, onChange } = props;

  const handleChange = useCallback(
    (property: Property) => {
      const updated: Property[] = properties.map((prop) => {
        if (prop.id === property.id) {
          return property;
        }
        return prop;
      });
      onChange(updated);
    },
    [onChange, properties]
  );

  const handleDelete = useCallback(
    (property: Property) => {
      const updated: Property[] = properties.filter((prop) => prop.id !== property.id);
      onChange(updated);
    },
    [onChange, properties]
  );

  const handleNewProperty = useCallback(() => {
    const updated = properties.concat([{ id: nanoid(), name: '', value: '' }]);
    onChange(updated);
  }, [onChange, properties]);

  return (
    <table className={Cls.table}>
      <thead>
        <tr>
          <th className={Cls.label}>{t('Property_name')}</th>
          <th className={Cls.value}>{t('Property_value')}</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property, i) => (
          <PropertyRow
            key={property.id}
            property={property}
            onChange={handleChange}
            onDelete={handleDelete}
            onNewProperty={handleNewProperty}
            isLast={i === properties.length - 1}
          />
        ))}
      </tbody>
    </table>
  );
}

interface PropertyRowProps {
  property: Property;
  onChange: (property: Property) => void;
  onDelete: (property: Property) => void;
  onNewProperty: () => void;
  isLast: boolean;
}

function PropertyRow(props: PropertyRowProps) {
  const { property, onChange, onDelete, onNewProperty, isLast } = props;
  const { t } = useTranslation('EditPropertiesModal');

  const handleNameChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.value;
      onChange({ ...property, name });
    },
    [onChange, property]
  );

  const handleValueChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      onChange({ ...property, value });
    },
    [onChange, property]
  );

  const handleDelete = useCallback(() => {
    onDelete(property);
  }, [onDelete, property]);

  return (
    <tr>
      <td className={Cls.label}>
        <input
          placeholder={'Nom'}
          value={property.name}
          onChange={handleNameChange}
          className={'form-control'}
          data-cy={`property-name`}
          data-testid={`property-name`}
        />
      </td>
      <td className={Cls.value}>
        <input
          placeholder={t('Value')}
          value={property.value + ''}
          onChange={handleValueChange}
          className={'form-control'}
          data-cy={`property-value`}
          data-testid={`property-value`}
        />
        <button
          title={t('Delete_property')}
          onClick={handleDelete}
          className={'ml-2 btn btn-link btn-sm'}
          data-cy={`delete-button`}
          data-testid={`delete-button`}
        >
          <FaIcon icon={IconDefs.faTrash} />
        </button>
      </td>
      <td>
        {!isLast && <>&nbsp;</>}
        {isLast && (
          <button
            onClick={onNewProperty}
            className={clsx(`btn btn-link btn-sm`, Cls.buttonNew)}
            title={t('New_property')}
            data-cy={'new-property-button'}
            data-testid={'new-property-button'}
          >
            <FaIcon icon={IconDefs.faPlus} size={'1.2rem'} />
          </button>
        )}
      </td>
    </tr>
  );
}
