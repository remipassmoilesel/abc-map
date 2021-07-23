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
import { FrontendRoutes, LayoutFormat, LayoutFormats, LegendDisplay, Logger } from '@abc-map/shared';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExportFormat } from '../ExportFormat';
import { LabeledLegendDisplays } from './LabeledLegendDisplay';

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

class LayoutControls extends Component<Props, {}> {
  public render(): ReactNode {
    const format = this.props.format;
    const legendDisplay = this.props.legendDisplay;
    const handleNewLayout = this.props.onNewLayout;
    const handleLayoutUp = this.props.onLayoutUp;
    const handleLayoutDown = this.props.onLayoutDown;
    const handleClearAll = this.props.onClearAll;
    const handleExport = this.props.onExport;

    const formatOptions = LayoutFormats.All.map((fmt) => (
      <option key={fmt.name} value={fmt.name}>
        {fmt.name}
      </option>
    ));

    const legendOptions = LabeledLegendDisplays.All.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ));

    return (
      <>
        <div className={'control-block'}>
          <button onClick={handleNewLayout} className={'btn btn-outline-primary mb-3'} data-cy={'new-layout'}>
            <i className={'fa fa-plus mr-2'} />
            Nouvelle page
          </button>

          <div className={'mb-2'}>Format:</div>
          <select onChange={this.handleFormatChanged} value={format?.name} className={'form-control'} data-cy={'format-select'}>
            <option>...</option>
            {formatOptions}
          </select>
        </div>

        <div className={'control-block'}>
          <div className={'mb-2'}>Légende:</div>
          <select onChange={this.handleLegendDisplayChanged} value={legendDisplay} className={'form-control mb-3'} data-cy={'legend-select'}>
            <option>...</option>
            {legendOptions}
          </select>
          <button onClick={this.handleEditLegend} className={'btn btn-outline-secondary'} data-cy={'edit-legend'}>
            <i className={'fa fa-pen mr-2'} />
            Editer la légende
          </button>
        </div>

        <div className={'control-block'}>
          <div className={'control-item'}>
            <button onClick={handleLayoutUp} className={'btn btn-link'} data-cy={'layout-up'}>
              <i className={'fa fa-arrow-up mr-2'} />
              Monter
            </button>
          </div>
          <div className={'control-item'}>
            <button onClick={handleLayoutDown} className={'btn btn-link'} data-cy={'layout-down'}>
              <i className={'fa fa-arrow-down mr-2'} />
              Descendre
            </button>
          </div>
          <div className={'control-item'}>
            <button onClick={handleClearAll} className={'btn btn-link'} data-cy={'clear-all'}>
              <i className={'fa fa-trash-alt mr-2'} />
              Supprimer tout
            </button>
          </div>
        </div>

        <div className={'control-block'}>
          <div className={'control-item'}>
            <button onClick={() => handleExport(ExportFormat.PDF)} className={'btn btn-link'} data-cy={'pdf-export'}>
              <i className={'fa fa-download mr-2'} />
              Export PDF
            </button>
          </div>
          <div className={'control-item'}>
            <button onClick={() => handleExport(ExportFormat.PNG)} className={'btn btn-link'} data-cy={'png-export'}>
              <i className={'fa fa-download mr-2'} />
              Export PNG
            </button>
          </div>
        </div>
      </>
    );
  }

  private handleEditLegend = () => {
    this.props.history.push(FrontendRoutes.mapLegend().raw());
  };

  private handleFormatChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const format = LayoutFormats.All.find((fmt) => fmt.name === value);
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

export default withRouter(LayoutControls);
