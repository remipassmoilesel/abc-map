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
import { LayoutFormat, LayoutFormats, LegendDisplay, Logger } from '@abc-map/shared';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExportFormat } from '../ExportFormat';
import { LabeledLegendDisplays } from './LabeledLegendDisplay';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { LabeledLayoutFormats } from './LabeledLayoutFormats';
import HistoryControls from '../../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { Routes } from '../../../routes';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';

const logger = Logger.get('LayoutControls.tsx', 'warn');

interface Props extends RouteComponentProps {
  format?: LayoutFormat;
  legendDisplay?: LegendDisplay;
  onFormatChanged: (f: LayoutFormat) => void;
  onNewLayout: () => void;
  onLayoutUp: () => void;
  onLayoutDown: () => void;
  onClearAll: () => void;
  onLegendChanged: (d: LegendDisplay) => void;
  onExport: (f: ExportFormat) => void;
}

const t = prefixedTranslation('LayoutView:');

class LayoutControls extends Component<Props, {}> {
  public render(): ReactNode {
    const format = this.props.format;
    const legendDisplay = this.props.legendDisplay;
    const handleNewLayout = this.props.onNewLayout;
    const handleLayoutUp = this.props.onLayoutUp;
    const handleLayoutDown = this.props.onLayoutDown;
    const handleClearAll = this.props.onClearAll;
    const handleExport = this.props.onExport;

    const formatOptions = LabeledLayoutFormats.All.map((fmt) => (
      <option key={fmt.format.id} value={fmt.format.id}>
        {t(fmt.i18nLabel)}
      </option>
    ));

    const legendOptions = LabeledLegendDisplays.All.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {t(opt.i18nLabel)}
      </option>
    ));

    return (
      <>
        {/* Undo redo */}
        <HistoryControls historyKey={HistoryKey.Layout} />

        {/* Change format */}
        <div className={'control-block'}>
          <div className={'mb-2'}>{t('Format')}:</div>
          <select onChange={this.handleFormatChanged} value={format?.id} className={'form-select mb-3'} data-cy={'format-select'}>
            <option>...</option>
            {formatOptions}
          </select>
        </div>

        {/* New layout, move layout, delete */}
        <div className={'control-block'}>
          <div className={'control-item'}>
            <button onClick={handleNewLayout} className={'btn btn-link'} data-cy={'new-layout'}>
              <FaIcon icon={IconDefs.faPlus} className={'mr-2'} />
              {t('New_layout')}
            </button>
          </div>
          <div className={'control-item'}>
            <button onClick={handleLayoutUp} className={'btn btn-link'} data-cy={'layout-up'}>
              <FaIcon icon={IconDefs.faArrowUp} className={'mr-2'} />
              {t('Move_up')}
            </button>
          </div>
          <div className={'control-item'}>
            <button onClick={handleLayoutDown} className={'btn btn-link'} data-cy={'layout-down'}>
              <FaIcon icon={IconDefs.faArrowDown} className={'mr-2'} />
              {t('Move_Down')}
            </button>
          </div>
          <div className={'control-item'}>
            <button onClick={handleClearAll} className={'btn btn-link'} data-cy={'clear-all'}>
              <FaIcon icon={IconDefs.faTrashAlt} className={'mr-2'} />
              {t('Delete_all')}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className={'control-block'}>
          <div className={'mb-2'}>{t('Legend')}</div>
          <select onChange={this.handleLegendDisplayChanged} value={legendDisplay} className={'form-select mb-3'} data-cy={'legend-select'}>
            <option>...</option>
            {legendOptions}
          </select>

          <div className={'control-item'}>
            <button onClick={this.handleEditLegend} className={'btn btn-link'} data-cy={'edit-legend'}>
              <FaIcon icon={IconDefs.faPen} className={'mr-2'} />
              {t('Edit_legend')}
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

  private handleEditLegend = () => {
    this.props.history.push(Routes.mapLegend().format());
  };

  private handleFormatChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const format = LayoutFormats.All.find((fmt) => fmt.id === value);
    if (!format) {
      logger.error(`Format not found: ${value}`);
      return;
    }

    this.props.onFormatChanged(format);
  };

  private handleLegendDisplayChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const display = LabeledLegendDisplays.All.find((fmt) => fmt.value === value);
    if (!display) {
      logger.error(`Display not found: ${value}`);
      return;
    }

    this.props.onLegendChanged(display.value);
  };
}

export default withTranslation()(withRouter(LayoutControls));
