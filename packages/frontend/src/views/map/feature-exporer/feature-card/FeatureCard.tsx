/**
 * Copyright © 2022 Rémi Pace.
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

import Cls from './FeatureCard.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Dropdown } from 'react-bootstrap';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { DataPropertiesMap, FeatureWrapper } from '../../../../core/geo/features/FeatureWrapper';
import { getFieldNames } from '../../../../core/data/getFieldNames';

const logger = Logger.get('FeatureRow.ts');

interface Props {
  index: number;
  feature: FeatureWrapper;
  onHighlight: (f: FeatureWrapper) => void;
  mainField: string | undefined;
  onZoomOn: (f: FeatureWrapper) => void;
  onDelete: (f: FeatureWrapper) => void;
  onToggleSelect: (f: FeatureWrapper) => void;
  onEdit: (f: FeatureWrapper) => void;
  className?: string;
}

export function FeatureCard(props: Props) {
  const { index, feature, onHighlight, mainField, onZoomOn, onDelete, onToggleSelect, onEdit, className } = props;
  const { t } = useTranslation('MapView');
  const [open, setOpen] = useState(false);

  const selected = feature.isSelected();
  const highlighted = feature.isHighlighted();

  // We must keep field names state here, otherwise UI updates may be missed after property edit
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [featureData, setFeatureData] = useState<DataPropertiesMap>({});

  // We keep track of events in order to update DOM when feature change
  const [, setEventIncrement] = useState(0);
  useEffect(() => {
    // We can no use revision number here because properties changes does not increment revision number
    const handleChange = () => {
      setEventIncrement((st) => st++);

      const row = feature.toDataRow();
      setFeatureData(row.data);
      setFieldNames(getFieldNames(row));
    };

    // We trigger the first time
    handleChange();

    feature.unwrap().on('change', handleChange);
    feature.unwrap().on('propertychange', handleChange);
    return () => {
      feature.unwrap().un('change', handleChange);
      feature.unwrap().un('propertychange', handleChange);
    };
  }, [feature, open]);

  const geometryType = feature.getGeometry()?.getType();
  const title = (mainField && featureData[mainField]) || geometryType;

  const handleToggleCard = useCallback(() => {
    setOpen((st) => !st);
  }, []);

  const handleHighlight = useCallback(() => onHighlight(feature), [feature, onHighlight]);

  const handleZoomOn = useCallback(() => onZoomOn(feature), [feature, onZoomOn]);

  const handleDelete = useCallback(() => onDelete(feature), [feature, onDelete]);

  const handleToggleSelect = useCallback(() => onToggleSelect(feature), [feature, onToggleSelect]);

  const handleEdit = useCallback(() => onEdit(feature), [feature, onEdit]);

  return (
    <div className={clsx('card card-body', highlighted && Cls.highlighted, selected && Cls.selected, className)}>
      <div onClick={handleToggleCard} className={clsx(Cls.header, open && 'mb-3')} data-testid={'feature'}>
        <span className={'text-secondary'}>{index}.</span> <span className={clsx(open && 'fw-bold')}>{title}</span>
      </div>

      {open && (
        <>
          <table className={'w-100 table table-sm table-bordered table-hover'}>
            <tbody>
              {fieldNames.map((fieldName) => (
                <tr key={`${fieldName}_${feature.getId()}`}>
                  <td className={'w-25'}>{fieldName}</td>
                  <td className={clsx(Cls.dataCell, 'text-bold')}>{featureData[fieldName] ?? t('Undefined_value')}</td>
                </tr>
              ))}

              <tr>
                <td>{t('Geometry')}</td>
                <td className={clsx(Cls.dataCell, 'text-bold')}>{geometryType ?? t('Undefined_value')}</td>
              </tr>
            </tbody>
          </table>

          <div className={'w-100 d-flex justify-content-end'}>
            <button onClick={handleEdit} title={t('Edit_data')} className={'btn btn-sm btn-outline-secondary me-2'} data-testid={'edit-data'}>
              <FaIcon icon={IconDefs.faPen} className={'mx-1'} />
            </button>

            <button onClick={handleZoomOn} title={t('Zoom_on')} className={'btn btn-sm btn-outline-secondary me-2'}>
              <FaIcon icon={IconDefs.faSearch} className={'mx-1'} />
            </button>

            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" data-testid={'feature-actions'}>
                {t('More')}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleToggleSelect}>
                  <FaIcon icon={IconDefs.faHighlighter} className={'me-2'} />
                  {t('Select_unselect')}
                </Dropdown.Item>

                <Dropdown.Item onClick={handleHighlight}>
                  <FaIcon icon={IconDefs.faPlus} className={'me-2'} />
                  {t('Temporarily_highlight')}
                </Dropdown.Item>

                <Dropdown.Item onClick={handleDelete}>
                  <FaIcon icon={IconDefs.faTrash} className={'me-2'} />
                  {t('Delete')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      )}
    </div>
  );
}
