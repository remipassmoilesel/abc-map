/**
 * Copyright © 2023 Rémi Pace.
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

import React, { useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { StyleFactory } from '../../../../../core/geo/styles/StyleFactory';
import { MapSymbolButton } from './MapSymbolButton';
import { useTranslation, withTranslation } from 'react-i18next';
import Cls from './MapSymbolPickerModal.module.scss';
import { FaIcon } from '../../../../icon/FaIcon';
import { IconDefs } from '../../../../icon/IconDefs';
import { StyleCacheEntry } from '../../../../../core/geo/styles/StyleCache';

interface Props {
  onSelected: (style: StyleCacheEntry) => void;
  onCancel: () => void;
}

function MapSymbolPickerModal(props: Props) {
  const { onSelected, onCancel } = props;
  const { t } = useTranslation('MapSymbolPickerModal');
  const [styles] = useState(() => StyleFactory.get().getAvailableStyles(1));
  const handleSymbolSelected = useCallback((style: StyleCacheEntry) => onSelected(style), [onSelected]);

  return (
    <Modal show={true} onHide={onCancel} size={'xl'} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaIcon icon={IconDefs.faMapMarkerAlt} className={'mr-3'} />
          {t('Select_symbol')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'mb-4'}>{t('Here_are_the_geometry_styles_used_on_the_map')}:</div>
        <div className={Cls.symbolContainer}>
          {styles.map((entry) => (
            <MapSymbolButton key={entry.id} style={entry} onClick={handleSymbolSelected} />
          ))}
          {!styles.length && (
            <div className={Cls.noSymbol}>
              <FaIcon icon={IconDefs.faExclamation} className={Cls.bigIcon} />
              {t('Add_something_on_map_then_come_back')}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default withTranslation()(MapSymbolPickerModal);
