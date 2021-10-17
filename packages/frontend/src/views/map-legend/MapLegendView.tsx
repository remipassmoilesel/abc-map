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
import { AbcLegendItem, FrontendRoutes, Logger } from '@abc-map/shared';
import { MainState } from '../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { ServiceProps, withServices } from '../../core/withServices';
import LegendPreview from './preview/LegendPreview';
import LegendUpdateForm from './legend-update/LegendUpdateForm';
import { RouteComponentProps } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './MapLegendView.module.scss';

const logger = Logger.get('MapLegendView.tsx');

const mapStateToProps = (state: MainState) => ({
  legend: state.project.legend,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps & RouteComponentProps<{}, {}>;

const t = prefixedTranslation('MapLegendView:');

class MapLegendView extends Component<Props, {}> {
  public render(): ReactNode {
    const legend = this.props.legend;

    return (
      <div className={Cls.mapLegendView}>
        <div className={'d-flex flex-row justify-content-end'}>
          <button className={'btn btn-outline-primary'} onClick={this.handleGoToLayout} data-cy={'back-to-layout'}>
            <i className={'fa fa-arrow-circle-left mr-2'} />
            {t('Go_back_to_layout')}
          </button>
        </div>

        <div className={Cls.content}>
          <div className={Cls.editionPanel}>
            <h5 className={'mb-4'}>{t('Edit_legend')}</h5>
            <LegendUpdateForm
              legend={legend}
              onSizeChanged={this.handleSizeChanged}
              onNewItem={this.handleNewItem}
              onItemChanged={this.handleItemChanged}
              onItemDeleted={this.handleItemDeleted}
              onItemUp={this.handleItemUp}
              onItemDown={this.handleItemDown}
            />
          </div>
          <div className={Cls.previewPanel}>
            <h5 className={'mb-4'}>{t('Preview')}</h5>
            <LegendPreview legend={legend} onSizeChanged={this.handleSizeChanged} />
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('Edit_legend'), t('Create_legend_for_your_map'));
  }

  private handleSizeChanged = (width: number, height: number) => {
    const { project } = this.props.services;

    project.setLegendSize(width, height);
  };

  private handleNewItem = (item: AbcLegendItem) => {
    const { project } = this.props.services;

    project.addLegendItems([item]);
  };

  private handleItemChanged = (item: AbcLegendItem) => {
    const { project } = this.props.services;

    project.updateLegendItem(item);
  };

  private handleGoToLayout = () => {
    this.props.history.push(FrontendRoutes.layout().raw());
  };

  private handleItemDeleted = (item: AbcLegendItem) => {
    const { project } = this.props.services;

    project.deleteLegendItem(item);
  };

  private handleItemUp = (item: AbcLegendItem) => {
    this.moveItem(item, -1);
  };

  private handleItemDown = (item: AbcLegendItem) => {
    this.moveItem(item, +1);
  };

  private moveItem(item: AbcLegendItem, diff: number): void {
    const { toasts, project } = this.props.services;

    const items = this.props.legend.items;
    const oldIndex = items.findIndex((i) => i.id === item.id);
    if (oldIndex === -1) {
      logger.error('Item not found: ', { item, diff });
      toasts.genericError();
      return;
    }

    let newIndex = oldIndex + diff;
    if (newIndex < 0) {
      newIndex = 0;
    }
    if (newIndex >= items.length) {
      newIndex = items.length - 1;
    }

    project.setLegendItemIndex(item, newIndex);
  }
}

export default withTranslation()(withServices(connector(MapLegendView)));
