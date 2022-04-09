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

import { useCallback, useState } from 'react';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { IconDefs } from '../../../icon/IconDefs';
import MapSymbolPickerModal from './picker-modal/MapSymbolPickerModal';
import { useEditor } from '../../useEditor';
import { StyleCacheEntry } from '../../../../core/geo/styles/StyleCache';
import { CustomEditor } from '../../CustomEditor';
import { ButtonMenu } from '../../../button-menu/ButtonMenu';
import { Action } from '../../../button-menu/Action';
import { StyleFactory } from '../../../../core/geo/styles/StyleFactory';
import { useServices } from '../../../../core/useServices';
import { AbcGeometryType, FeatureStyle } from '@abc-map/shared';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

const styleFactory = StyleFactory.get();

export function MapSymbol(props: Props) {
  const { toasts } = useServices();
  const { className } = props;
  const { editor } = useEditor();
  const [modal, showModal] = useState(false);

  const handleToggleModal = useCallback(() => showModal(!modal), [modal]);

  const handleSelection = useCallback(
    (style: StyleCacheEntry) => {
      CustomEditor.mapSymbol.create(editor, style.properties, style.geomType);
      showModal(false);
    },
    [editor]
  );

  const handleCreateLegend = useCallback(() => {
    const styles: [FeatureStyle, AbcGeometryType][] = styleFactory.getAvailableStyles(1).map((st) => [st.properties, st.geomType]);
    if (!styles.length) {
      toasts.info(t('There_is_no_symbol_to_insert'));
      return;
    }

    CustomEditor.mapSymbol.createLegend(editor, styles);
  }, [editor, toasts]);

  return (
    <>
      <ButtonMenu label={t('Map_symbols')} icon={IconDefs.faMapMarkerAlt} className={className} closeOnClick={true}>
        <Action label={t('Insert_map_symbol')} onClick={handleToggleModal} icon={IconDefs.faMapMarkerAlt} />
        <Action label={t('Insert_map_legend')} onClick={handleCreateLegend} icon={IconDefs.faTable} />
      </ButtonMenu>
      {modal && <MapSymbolPickerModal onSelected={handleSelection} onCancel={handleToggleModal} />}
    </>
  );
}
