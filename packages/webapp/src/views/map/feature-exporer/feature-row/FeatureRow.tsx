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

import Cls from './FeatureRow.module.scss';
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Dropdown } from 'react-bootstrap';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { DataPropertiesMap, FeatureWrapper } from '../../../../core/geo/features/FeatureWrapper';
import { getFieldNames } from '../../../../core/data/getFieldNames';
import { getRemSize } from '../../../../core/ui/getRemSize';
import { createPortal } from 'react-dom';

const logger = Logger.get('FeatureRow.ts');

interface Props {
  feature: FeatureWrapper;
  index: number;
  onHighlight: (f: FeatureWrapper) => void;
  mainField: string | undefined;
  onZoomOn: (f: FeatureWrapper) => void;
  onDelete: (f: FeatureWrapper) => void;
  onSelect: (f: FeatureWrapper) => void;
  onEdit: (f: FeatureWrapper) => void;
  persistentState: FeatureRowPersistentState | undefined;
  onPersistentStateChange: (featureId: string, state: Partial<FeatureRowPersistentState>) => void;
  style?: CSSProperties;
}

// We use persistent state because the list uses virtual items, which are unmounted when hidden
export interface FeatureRowPersistentState {
  open: boolean;
}

export function featureRowClosedHeight(): number {
  return getRemSize() * 3.5 + getRemSize() * 0.5;
}

export function FeatureRow(props: Props) {
  const { t } = useTranslation('MapView');

  const { feature, index, onHighlight, mainField, onZoomOn, onDelete, onSelect, onEdit, persistentState, onPersistentStateChange, style } = props;
  const { open } = persistentState ?? { open: false, height: 0 };

  const selected = feature.isSelected();
  const highlighted = feature.isHighlighted();

  // We must keep field names state here, otherwise UI updates may be missed after property edit
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [featureData, setFeatureData] = useState<DataPropertiesMap>({});

  // We keep track of events in order to update DOM when feature change
  const [, setEventIncrement] = useState(0);
  useEffect(() => {
    // We can not use revision number here because properties changes does not increment revision number
    const handleChange = () => {
      setEventIncrement((st) => st + 1);

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

  const handleOpen = useCallback(() => {
    const featureId = feature.getId();
    if (typeof featureId !== 'string') {
      logger.error('Bad feature: ', feature);
      return;
    }

    onPersistentStateChange(featureId, { open: !persistentState?.open });
  }, [feature, onPersistentStateChange, persistentState?.open]);

  const handleHighlight = useCallback(() => onHighlight(feature), [feature, onHighlight]);

  const handleZoomOn = useCallback(() => onZoomOn(feature), [feature, onZoomOn]);

  const handleDelete = useCallback(() => onDelete(feature), [feature, onDelete]);

  const handleToggleSelect = useCallback(() => onSelect(feature), [feature, onSelect]);

  const handleEdit = useCallback(() => onEdit(feature), [feature, onEdit]);

  return (
    <div style={style} className={'me-1 mb-1'}>
      <div className={clsx('card', highlighted && Cls.highlighted, selected && Cls.selected)}>
        <div className={'card-body'}>
          <div onClick={handleOpen} title={title + ''} className={clsx(Cls.header, open && 'mb-3')} data-testid={'feature'}>
            <span className={'text-secondary'}>{index + 1}.</span> <span className={clsx(open && 'fw-bold')}>{title}</span>
          </div>

          {open && (
            <>
              <table className={'w-100 table table-sm table-bordered table-hover'}>
                <tbody>
                  {fieldNames.map((fieldName) => {
                    const value = featureData[fieldName] ?? t('Undefined_value');

                    return (
                      <tr key={`${fieldName}_${feature.getId()}`}>
                        <td className={'w-25'}>{fieldName}</td>
                        <td className={clsx(Cls.dataCell, 'text-bold')} title={value + ''}>
                          {value}
                        </td>
                      </tr>
                    );
                  })}

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

                  {/* We need to create a portal because of virtualized list system */}
                  {createPortal(
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleHighlight}>
                        <FaIcon icon={IconDefs.faHighlighter} className={'me-2'} />
                        {t('Temporarily_highlight')}
                      </Dropdown.Item>

                      <Dropdown.Item onClick={handleToggleSelect}>
                        <FaIcon icon={IconDefs.faPlus} className={'me-2'} />
                        {t('Select_unselect')}
                      </Dropdown.Item>

                      <Dropdown.Item onClick={handleDelete}>
                        <FaIcon icon={IconDefs.faTrash} className={'me-2'} />
                        {t('Delete')}
                      </Dropdown.Item>
                    </Dropdown.Menu>,
                    document.body
                  )}
                </Dropdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
