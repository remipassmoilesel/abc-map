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

import Cls from './MapRotation.module.scss';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import clsx from 'clsx';
import { toRadians } from '../../core/utils/numbers';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { prefixedTranslation } from '../../i18n/i18n';
import { Modal } from 'react-bootstrap';
import { NorthArrow } from '../north-arrow/NorthArrow';
import { WithTooltip } from '../with-tooltip/WithTooltip';

const t = prefixedTranslation('MapRotation:');

interface Props {
  map: MapWrapper;
  className?: string;
}

export function MapRotation(props: Props) {
  const { map, className } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(Infinity);
  const [sliderValue, setSliderValue] = useState(Infinity);

  useEffect(() => {
    const handleViewChange = () => {
      const rotationDegrees = map.getRotation();
      setRotationDegrees(rotationDegrees);
      setSliderValue(rotationDegrees);
    };

    // We trigger a manual update on mount
    handleViewChange();

    // We listen for user changes
    map.unwrap().on('pointerdrag', handleViewChange);
    map.unwrap().on('moveend', handleViewChange);
    return () => {
      map.unwrap().un('pointerdrag', handleViewChange);
      map.unwrap().un('moveend', handleViewChange);
    };
  }, [map]);

  const handleCompassClick = useCallback(() => setModalOpen(true), []);

  const handleClose = useCallback(() => setModalOpen(false), []);

  const handleRestore = useCallback(() => {
    map.unwrap().getView().setRotation(0);
    setRotationDegrees(0);
    setSliderValue(0);
  }, [map]);

  const handleSliderChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(ev.target.value);

      map.unwrap().getView().setRotation(toRadians(value));
      setRotationDegrees(value);
      setSliderValue(value);
    },
    [map]
  );

  return (
    <>
      <button onClick={handleCompassClick} className={clsx(Cls.button, className)}>
        <WithTooltip title={t('North_direction')} placement={'top'}>
          <div>
            <NorthArrow size={'3.5rem'} rotation={rotationDegrees} className={Cls.arrow} />
          </div>
        </WithTooltip>
      </button>

      {modalOpen && (
        <Modal show={true} onHide={handleClose} centered>
          <Modal.Header closeButton>{t('Rotation')}</Modal.Header>
          <Modal.Body className={'d-flex flex-column'}>
            {/* Keyboard shortcut tip */}
            <div className={'alert alert-info mb-3'}>{t('To_rotate_the_map_use_alt_shift_drag_or_pinch_and_rotate_the_map')}</div>

            {/* Slider and current value */}
            <div className={'mb-3'}>
              <div>{t('Rotation')}:</div>

              <div className={'d-flex align-items-center'}>
                <input type="range" value={sliderValue} onChange={handleSliderChange} min={-359} max={359} className="form-range" />
                <div className={'ml-4 mr-2'}>{sliderValue}&nbsp;°</div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={handleRestore} className={'btn btn-outline-danger'}>
              {t('Restore_rotation')}
            </button>

            <button onClick={handleClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'} data-testid={'close-modal'}>
              {t('Close')}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
