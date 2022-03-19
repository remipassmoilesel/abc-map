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

import React, { ChangeEvent, useCallback, useState } from 'react';
import { AbcLayout, AbcTextFrame, LayoutFormat, LayoutFormats, Logger } from '@abc-map/shared';
import { ExportFormat } from '../ExportFormat';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { LabeledLayoutFormats } from './LabeledLayoutFormats';
import HistoryControls from '../../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import CopyTextFrameModal from '../../../components/copy-text-frame-modal/CopyTextFrameModal';
import { TextFrameFactory } from '../../../core/project/TextFrameFactory';
import { AbcScale } from '@abc-map/shared';

const logger = Logger.get('ExportControls.tsx', 'warn');

interface Props {
  activeLayout?: AbcLayout;
  onFormatChanged: (f: LayoutFormat) => void;
  onNewLayout: () => void;
  onLayoutUp: () => void;
  onLayoutDown: () => void;
  onClearAll: () => void;
  onAddTextFrame: (frame: AbcTextFrame) => void;
  onExport: (format: ExportFormat) => void;
  onAddScale: (scale: AbcScale) => void;
  onRemoveScale: () => void;
}

const t = prefixedTranslation('ExportView:');

function ExportControls(props: Props) {
  const {
    activeLayout,
    onNewLayout: handleNewLayout,
    onLayoutUp: handleLayoutUp,
    onLayoutDown: handleLayoutDown,
    onClearAll: handleClearAll,
    onExport: handleExport,
    onAddTextFrame: handleAddTextFrame,
    onFormatChanged,
    onAddScale,
    onRemoveScale,
  } = props;

  const [copyFrameModal, showCopyFrameModal] = useState(false);

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

  const handleNewTextFrame = useCallback(() => handleAddTextFrame(TextFrameFactory.newFrame()), [handleAddTextFrame]);

  const handleToggleCopyFrameModal = useCallback(() => showCopyFrameModal(!copyFrameModal), [copyFrameModal]);

  const handleCopyFrameConfirm = useCallback((frame: AbcTextFrame) => handleAddTextFrame(frame), [handleAddTextFrame]);

  const handleToggleScale = useCallback(() => {
    if (activeLayout?.scale) {
      onRemoveScale();
    } else {
      onAddScale({ x: 30, y: 30 });
    }
  }, [activeLayout?.scale, onAddScale, onRemoveScale]);

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
      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={handleNewTextFrame} disabled={!activeLayout} className={'btn btn-link'} data-cy={'create-text-frame'}>
            <FaIcon icon={IconDefs.faFont} className={'mr-2'} />
            {t('New_text_frame')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleToggleCopyFrameModal} disabled={!activeLayout} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faCopy} className={'mr-2'} />
            {t('Copy_text_frame')}
          </button>
        </div>

        {copyFrameModal && <CopyTextFrameModal onConfirm={handleCopyFrameConfirm} onCancel={handleToggleCopyFrameModal} />}
      </div>

      {/* Scale */}
      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={handleToggleScale} disabled={!activeLayout} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faRulerHorizontal} className={'mr-2'} />
            {activeLayout?.scale ? t('Remove_scale') : t('Add_scale')}
          </button>
        </div>
      </div>

      {/* Export buttons */}
      <div className={'control-block'}>
        <div className={'control-item d-flex justify-content-center my-3'}>
          <button onClick={() => handleExport(ExportFormat.PDF)} className={'btn btn-primary'} data-cy={'pdf-export'}>
            <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
            {t('PDF_export')}
          </button>
        </div>
        <div className={'control-item d-flex justify-content-center mb-3'}>
          <button onClick={() => handleExport(ExportFormat.PNG)} className={'btn btn-outline-primary'} data-cy={'png-export'}>
            <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
            {t('PNG_export')}
          </button>
        </div>
      </div>
    </>
  );
}
export default withTranslation()(ExportControls);
