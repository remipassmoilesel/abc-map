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

import Cls from './Preloader.module.scss';
import { prefixedTranslation } from '../../../../i18n/i18n';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { MapWrapper } from '../../../../core/geo/map/MapWrapper';
import { MapPreloader, PreloadEvent } from '../../../../core/geo/MapPreloader';
import { Logger } from '@abc-map/shared';
import { useServices } from '../../../../core/useServices';
import { WithTooltip } from '../../../../components/with-tooltip/WithTooltip';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { Modal } from 'react-bootstrap';
import { InlineLoader } from '../../../../components/inline-loader/InlineLoader';
import clsx from 'clsx';

const logger = Logger.get('Preloader.tsx');

const t = prefixedTranslation('MapView:MainMap.');

interface Props {
  map: MapWrapper;
  className?: string;
}

enum Quantity {
  ALittle = 'ALittle',
  ALot = 'ALot',
}

const Params: { [k: string]: number } = {
  [Quantity.ALittle]: 2,
  [Quantity.ALot]: 4,
};

export function Preloader(props: Props) {
  const { map, className } = props;
  const { toasts } = useServices();
  const preloaderRef = useRef<MapPreloader | null>(null);
  const cancelLoading = useRef<(() => void) | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(Quantity.ALittle);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    preloaderRef.current = new MapPreloader();
    preloaderRef.current.init();

    const handleLoadEvent = (ev: CustomEvent<PreloadEvent>) => {
      setLoadingProgress(ev.detail.value);
      if (ev.detail.value === 100) {
        setTimeout(() => setLoading(false), 2_000);
      }
    };
    preloaderRef.current.addEventListener(handleLoadEvent);

    return () => {
      preloaderRef.current?.removeEventListener(handleLoadEvent);
      preloaderRef.current?.dispose();
    };
  }, []);

  const handleOpenModal = useCallback(() => setModalVisible(true), []);
  const handleCloseModal = useCallback(() => setModalVisible(false), []);

  const handleQuantityChange = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value as Quantity;
    setQuantity(value);
  }, []);

  const handlePreload = () => {
    const preloader = preloaderRef.current;
    if (!preloader) {
      logger.error('Preloader not ready');
      return;
    }

    // Cancel previous loading if any
    cancelLoading.current && cancelLoading.current();

    // Start loading
    const { cancel, promise } = preloader.load(map, Params[quantity]);
    promise.catch((err) => {
      logger.error('Preloading error: ', err);
      toasts.genericError();
    });
    cancelLoading.current = cancel;

    // Update display
    setLoadingProgress(0);
    setLoading(true);
    setModalVisible(false);
  };

  return (
    <>
      <WithTooltip title={t('Preload_map')} placement={'top'}>
        <button onClick={handleOpenModal} className={clsx(Cls.button, className)}>
          {!loading && <FaIcon icon={IconDefs.faDownload} className={Cls.icon} />}
          {loading && (
            <div className={'d-flex align-items-center justify-content-center'}>
              <InlineLoader active={loading} size={2} />
            </div>
          )}
        </button>
      </WithTooltip>

      {modal && (
        <Modal show={modal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('Preload_map')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={'alert alert-info'}>{t('You_can_preload_a_map_area_for_offline_use')}</div>

            <select onChange={handleQuantityChange} className={'form-select mb-3'}>
              <option value={Quantity.ALittle}>{t(Quantity.ALittle)}</option>
              <option value={Quantity.ALot}>{t(Quantity.ALot)}</option>
            </select>

            <div className={'d-flex align-items-center mb-3'}>
              <InlineLoader active={loading} size={2} className={'mr-2'} />
              {loading && <div>{loadingProgress + '%'}</div>}
            </div>

            <div className={'d-flex justify-content-end'}>
              <button onClick={handleCloseModal} className={'btn btn-outline-secondary mr-3'}>
                {t('Cancel')}
              </button>
              <button onClick={handlePreload} className={'btn btn-primary'}>
                {t('Preload_map')}
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
