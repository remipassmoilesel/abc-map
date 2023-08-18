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

import Cls from './ExportControls.module.scss';
import React, { ChangeEvent, useCallback } from 'react';
import { AbcNorth, AbcScale, AbcTextFrame, LayoutFormat, LayoutFormats, Logger } from '@abc-map/shared';
import { ExportFormat } from '../ExportFormat';
import { useTranslation, withTranslation } from 'react-i18next';
import { LabeledLayoutFormats } from './LabeledLayoutFormats';
import HistoryControls from '../../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { useAppSelector } from '../../../core/store/hooks';
import { useActiveLayout } from '../../../core/project/useActiveLayout';
import { ScaleControls } from '../../../components/scale-controls/ScaleControls';
import { TextFrameControls } from '../../../components/text-frame-controls/TextFrameControls';
import clsx from 'clsx';
import { NorthControls } from '../../../components/north-controls/NorthControls';

const logger = Logger.get('ExportControls.tsx', 'warn');

interface Props {
  onFormatChanged: (f: LayoutFormat) => void;
  onNewLayout: () => void;
  onLayoutUp: () => void;
  onLayoutDown: () => void;
  onClearAll: () => void;
  onAddTextFrame: (frame: AbcTextFrame) => void;
  onExport: (format: ExportFormat) => void;
  onAddScale: (scale: AbcScale) => void;
  onRemoveScale: () => void;
  onAddNorth: (north: AbcNorth) => void;
  onRemoveNorth: () => void;
  onAbcMapAttributionsChange: (value: boolean) => void;
}

function ExportControls(props: Props) {
  const {
    onNewLayout: handleNewLayout,
    onLayoutUp: handleLayoutUp,
    onLayoutDown: handleLayoutDown,
    onClearAll: handleClearAll,
    onExport: handleExport,
    onAddTextFrame,
    onFormatChanged,
    onAddScale,
    onRemoveScale,
    onAddNorth,
    onRemoveNorth,
    onAbcMapAttributionsChange,
  } = props;

  const { t } = useTranslation('StaticExport');

  const activeLayout = useActiveLayout();
  const layouts = useAppSelector((st) => st.project.layouts.list);
  const exportDisabled = !layouts.length;

  const handleFormatChanged = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const value = ev.target.value;
      const format = LayoutFormats.All.find((fmt) => fmt.id === value);
      if (!format) {
        logger.error(`Format not found: ${value}`);
        return;
      }

      onFormatChanged(format);
    },
    [onFormatChanged]
  );

  const handleAddTextFrame = useCallback(
    (frame: AbcTextFrame) =>
      onAddTextFrame({
        ...frame,
        position: {
          x: 60,
          y: 60,
        },
        size: {
          width: 1100,
          height: 450,
        },
      }),
    [onAddTextFrame]
  );

  const abcMapAttributions = useAppSelector((st) => st.project.layouts.abcMapAttributionsEnabled);

  const handleToggleAbcMapAttributions = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => onAbcMapAttributionsChange(ev.target.checked),
    [onAbcMapAttributionsChange]
  );

  return (
    <>
      {/* Undo redo */}
      <HistoryControls historyKey={HistoryKey.Export} />

      {/* Change format */}
      <div className={'control-block'}>
        <div className={'mb-2'}>{t('Format')}:</div>
        <select onChange={handleFormatChanged} value={activeLayout?.format?.id} className={'form-select mb-3'} data-cy={'format-select'}>
          <option>...</option>
          {LabeledLayoutFormats.All.map((fmt) => (
            <option key={fmt.format.id} value={fmt.format.id}>
              {t(fmt.i18nLabel)}
            </option>
          ))}
        </select>
      </div>

      {/* New layout, move layout, delete */}
      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={handleNewLayout} className={'btn btn-link'} data-cy={'add-layout'}>
            <FaIcon icon={IconDefs.faPlus} className={'mr-2'} />
            {t('New_layout')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleLayoutUp} disabled={!activeLayout} className={'btn btn-link'} data-cy={'layout-up'}>
            <FaIcon icon={IconDefs.faArrowUp} className={'mr-2'} />
            {t('Move_up')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleLayoutDown} disabled={!activeLayout} className={'btn btn-link'} data-cy={'layout-down'}>
            <FaIcon icon={IconDefs.faArrowDown} className={'mr-2'} />
            {t('Move_Down')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleClearAll} disabled={!activeLayout} className={'btn btn-link'} data-cy={'clear-all'}>
            <FaIcon icon={IconDefs.faTrashAlt} className={'mr-2'} />
            {t('Delete_all')}
          </button>
        </div>
      </div>

      {/* Text frames */}
      <TextFrameControls disabled={!activeLayout} onAddTextFrame={handleAddTextFrame} />

      {/* Scale */}
      <ScaleControls disabled={!activeLayout} hasScale={!!activeLayout?.scale} onAddScale={onAddScale} onRemoveScale={onRemoveScale} />

      {/* Scale */}
      <NorthControls disabled={!activeLayout} hasNorth={!!activeLayout?.north} onAddNorth={onAddNorth} onRemoveNorth={onRemoveNorth} />

      <div className={'control-block'}>
        <label>
          <input type={'checkbox'} checked={abcMapAttributions} onChange={handleToggleAbcMapAttributions} className={'me-2'} />
          {t('Show_AbcMap_attributions')}
        </label>
      </div>

      {/* Export buttons */}
      <div className={'control-block'}>
        <div className={'mb-3'}>{t('Export')}:</div>

        <div className={clsx('control-item', Cls.exportButtons)}>
          <button onClick={() => handleExport(ExportFormat.PDF)} disabled={exportDisabled} className={'btn btn-primary mb-2'} data-cy={'pdf-export'}>
            <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
            {t('PDF_document')}
          </button>
          <button onClick={() => handleExport(ExportFormat.PNG)} disabled={exportDisabled} className={'btn btn-outline-primary mb-2'} data-cy={'png-export'}>
            <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
            {t('PNG_images')}
          </button>
        </div>
      </div>
    </>
  );
}
export default withTranslation()(ExportControls);
