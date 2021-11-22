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

import React, { Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { LegendDisplay, Logger } from '@abc-map/shared';
import LayoutList from './layout-list/LayoutList';
import { AbcLayout, AbcProjection, LayoutFormat, LayoutFormats } from '@abc-map/shared';
import LayoutPreview from './layout-preview/LayoutPreview';
import { HistoryKey } from '../../core/history/HistoryKey';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { MainState } from '../../core/store/reducer';
import { ServiceProps, withServices } from '../../core/withServices';
import { AddLayoutsTask } from '../../core/history/tasks/layouts/AddLayoutsTask';
import { RemoveLayoutsTask } from '../../core/history/tasks/layouts/RemoveLayoutsTask';
import { SetLayoutIndexTask } from '../../core/history/tasks/layouts/SetLayoutIndexTask';
import { LayoutRenderer } from '../../core/project/rendering/LayoutRenderer';
import { UpdateLayoutTask } from '../../core/history/tasks/layouts/UpdateLayoutTask';
import { FileIO } from '../../core/utils/FileIO';
import { pageSetup } from '../../core/utils/page-setup';
import LayoutControls from './layout-controls/LayoutControls';
import { ExportFormat } from './ExportFormat';
import Cls from './LayoutView.module.scss';
import { prefixedTranslation } from '../../i18n/i18n';
import { OperationStatus } from '../../core/ui/typings';

const logger = Logger.get('LayoutView.tsx', 'warn');

interface State {
  /**
   * Reference to the main map
   */
  map: MapWrapper;
  /**
   * Id of active layout. We must not store layout here in order to get consistent updates.
   */
  activeLayoutId?: string;
}

const mapStateToProps = (state: MainState) => ({
  layouts: state.project.layouts,
  legend: state.project.legend,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

const t = prefixedTranslation('LayoutView:');

class LayoutView extends Component<Props, State> {
  private exportSupport = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { map: this.props.services.geo.getMainMap() };
  }

  public render(): ReactNode {
    const layouts = this.props.layouts;
    const legend = this.props.legend;
    const activeLayout = this.getActiveLayout();

    return (
      <div className={Cls.layoutView}>
        <div className={Cls.content}>
          {/* Layout list on left */}
          <div className={Cls.leftPanel}>
            <LayoutList layouts={layouts} active={activeLayout} onSelected={this.handleSelected} onDeleted={this.handleDeleted} />
          </div>

          {/* Layout preview on center */}
          <LayoutPreview
            layout={activeLayout}
            legend={legend}
            mainMap={this.state.map}
            onLayoutChanged={this.handleLayoutChanged}
            onNewLayout={this.handleNewLayout}
          />

          {/* Controls on right */}
          <div className={Cls.rightPanel} data-cy={'layout-controls'}>
            <LayoutControls
              format={activeLayout?.format}
              legendDisplay={legend.display}
              onFormatChanged={this.handleFormatChanged}
              onNewLayout={this.handleNewLayout}
              onLayoutUp={this.handleLayoutUp}
              onLayoutDown={this.handleLayoutDown}
              onClearAll={this.handleClearAll}
              onLegendChanged={this.handleLegendChanged}
              onExport={this.handleExport}
            />
          </div>
        </div>
        <div ref={this.exportSupport} />
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('Layout'), t('Create_layout_to_export_your_map'));

    const layouts = this.props.layouts;
    if (layouts.length) {
      this.setState({ activeLayoutId: layouts[0].id });
    }
  }

  public componentDidUpdate() {
    const layouts = this.props.layouts;
    const activeId = this.state.activeLayoutId;
    const activeExists = layouts.find((lay) => lay.id === activeId);

    if (!activeExists && layouts.length) {
      this.setState({ activeLayoutId: layouts[layouts.length - 1].id });
    }
  }

  private handleSelected = (lay: AbcLayout) => {
    this.setState({ activeLayoutId: lay.id });
  };

  private handleNewLayout = () => {
    const { project, history } = this.props.services;

    const name = `Page ${this.props.layouts.length + 1}`;
    const view = this.state.map.unwrap().getView();
    const center = view.getCenter();
    const resolution = view.getResolution();
    if (!center || !resolution) {
      logger.error('Cannot create new layout: ', { center, resolution });
      return;
    }

    // If resolution is below one, we keep it. Otherwise we use a greater one.
    const layoutRes = resolution < 1 ? resolution : Math.round(resolution - resolution * 0.2);
    const projection: AbcProjection = { name: view.getProjection().getCode() };
    const layout = project.newLayout(name, LayoutFormats.A4_LANDSCAPE, center, layoutRes, projection);
    history.register(HistoryKey.Layout, AddLayoutsTask.create([layout]));

    this.setState({ activeLayoutId: layout.id });
  };

  private handleLayoutUp = () => {
    this.updateLayoutIndex(-1);
  };

  private handleLayoutDown = () => {
    this.updateLayoutIndex(+1);
  };

  private updateLayoutIndex = (diff: number) => {
    const { project, history, toasts } = this.props.services;
    const active = this.getActiveLayout();
    const layouts = this.props.layouts;

    if (!active) {
      toasts.info(t('You_muse_select_a_layout'));
      return;
    }

    const oldIndex = layouts.findIndex((lay) => lay.id === active.id);
    let newIndex = oldIndex + diff;
    if (newIndex < 0) {
      newIndex = 0;
    }
    if (newIndex > layouts.length - 1) {
      newIndex = layouts.length - 1;
    }

    if (newIndex !== oldIndex) {
      project.setLayoutIndex(active, newIndex);
      history.register(HistoryKey.Layout, SetLayoutIndexTask.create(active, oldIndex, newIndex));
    }
  };

  private handleClearAll = () => {
    const { project, history } = this.props.services;
    const layouts = this.props.layouts;

    project.clearLayouts();
    history.register(HistoryKey.Layout, RemoveLayoutsTask.create(layouts));
  };

  private handleLegendChanged = (display: LegendDisplay) => {
    const { project } = this.props.services;

    project.setLegendDisplay(display);
  };

  private handleDeleted = (lay: AbcLayout) => {
    const { project, history } = this.props.services;

    project.removeLayout(lay.id);
    history.register(HistoryKey.Layout, RemoveLayoutsTask.create([lay]));
  };

  private handleFormatChanged = (format: LayoutFormat) => {
    const { project, history } = this.props.services;

    const active = this.getActiveLayout();
    const formatChanged = active?.format.id !== format.id;
    if (active && formatChanged) {
      const update: AbcLayout = {
        ...active,
        format,
      };

      project.updateLayout(update);
      history.register(HistoryKey.Layout, UpdateLayoutTask.create(active, update));
    }
  };

  private handleLayoutChanged = (layout: AbcLayout) => {
    const { project, history } = this.props.services;

    const before = this.props.layouts.find((lay) => lay.id === layout.id);
    if (before) {
      project.updateLayout(layout);
      history.register(HistoryKey.Layout, UpdateLayoutTask.create(before, layout));
    } else {
      logger.error('Cannot register history task', { before, layout });
    }
  };

  private handleExport = (format: ExportFormat) => {
    const { toasts, modals } = this.props.services;
    const support = this.exportSupport.current;
    const layouts = this.props.layouts;
    if (!support) {
      toasts.genericError();
      logger.error('DOM not ready');
      return;
    }

    const renderer = new LayoutRenderer();
    renderer.init(support);

    if (!layouts.length) {
      toasts.info(t('You_must_create_layouts_first'));
      return;
    }

    const exportLayouts = async () => {
      const map = this.state.map;
      const legend = this.props.legend;

      let result: Blob | undefined;
      switch (format) {
        case ExportFormat.PDF:
          result = await renderer.renderLayoutsAsPdf(layouts, legend, map);
          FileIO.outputBlob(result, 'map.pdf');
          break;

        case ExportFormat.PNG:
          result = await renderer.renderLayoutsAsPng(layouts, legend, map);
          FileIO.outputBlob(result, 'map.zip');
          break;

        default:
          logger.error('Unhandled format: ', format);
          toasts.genericError();
          return OperationStatus.Interrupted;
      }

      return OperationStatus.Succeed;
    };

    modals
      .longOperationModal(exportLayouts)
      .then(() => modals.solicitation())
      .catch((err) => {
        toasts.genericError();
        logger.error(err);
      })
      .finally(() => renderer.dispose());
  };

  private getActiveLayout(): AbcLayout | undefined {
    const activeId = this.state.activeLayoutId;
    if (!activeId) {
      return;
    }
    return this.props.layouts.find((lay) => lay.id === activeId);
  }
}

export default connector(withServices(LayoutView));
