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
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import { Modal } from 'react-bootstrap';
import { getAllIcons, safeGetIcon, PointIcon } from '../../../../../core/geo/styles/PointIcons';
import { IconProcessor } from '../../../../../core/geo/styles/IconProcessor';
import Cls from './PointIconSelector.module.scss';
import OptionRow from '../../_common/option-row/OptionRow';

interface IconPreview {
  icon: PointIcon;
  preview: string;
}

const mapStateToProps = (state: MainState) => ({
  point: state.map.currentStyle.point,
});

const mapDispatchToProps = {
  setPointIcon: MapActions.setPointIcon,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

interface State {
  modal: boolean;
  iconPreviews: IconPreview[];
  selectedPreview?: IconPreview;
}

const defaultPreviewColor = '#005de2';

class PointIconSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: false,
      iconPreviews: [],
    };
  }

  public render(): ReactNode {
    const iconPreviews = this.state.iconPreviews;
    const modal = this.state.modal;
    const selected = this.state.selectedPreview;

    return (
      <>
        {/* Button, always visible */}
        <OptionRow>
          <div className={'mr-2'}>Icône: </div>
          <button onClick={this.handleOpen} className={'btn btn-outline-secondary btn-sm'}>
            {!selected && 'Choisir'}
            {selected && <img src={selected.preview} alt={selected.icon.name} />}
          </button>
        </OptionRow>

        {/* Modal, visible on demand */}
        <Modal show={modal} onHide={this.handleCancel} size={'lg'} className={Cls.modal}>
          <Modal.Header closeButton>
            <Modal.Title>Icônes</Modal.Title>
          </Modal.Header>
          <Modal.Body className={'d-flex flex-column'}>
            <div className={Cls.viewPort}>
              {iconPreviews.map((i) => (
                <img
                  key={i.icon.name}
                  src={i.preview}
                  onClick={() => this.handleSelection(i.icon)}
                  className={`btn btn-outline-secondary ${Cls.iconPreview}`}
                  alt={i.icon.name}
                />
              ))}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  public componentDidMount() {
    this.updateSelectedPreview();
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const iconChanged = this.props.point?.icon !== prevProps.point?.icon;
    const colorChanged = this.props.point?.color !== prevProps.point?.color;
    if (iconChanged || colorChanged) {
      this.updateSelectedPreview();
    }
  }

  private handleOpen = (): void => {
    const color = this.props.point?.color || defaultPreviewColor;
    const iconPreviews = getAllIcons().map((i) => ({ icon: i, preview: IconProcessor.prepare(i, 50, color) }));
    this.setState({ iconPreviews, modal: true });
  };

  private handleCancel = (): void => {
    this.setState({ modal: false });
  };

  private handleSelection = (icon: PointIcon): void => {
    const { geo } = this.props.services;

    this.props.setPointIcon(icon.name);

    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        point: {
          ...style.point,
          icon: icon.name,
        },
      };
    });

    this.setState({ modal: false });
  };

  private updateSelectedPreview() {
    const iconName = this.props.point?.icon;
    if (!iconName) {
      this.setState({ selectedPreview: undefined });
      return;
    }

    const color = this.props.point?.color || defaultPreviewColor;
    const icon = safeGetIcon(iconName);
    const preview = IconProcessor.prepare(icon, 20, color);
    const selectedPreview: IconPreview = { icon, preview };
    this.setState({ selectedPreview });
  }
}

export default connector(withServices(PointIconSelector));
