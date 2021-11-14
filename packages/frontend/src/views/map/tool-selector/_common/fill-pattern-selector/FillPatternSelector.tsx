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
import { FillPatterns } from '@abc-map/shared';
import { LabeledFillPatterns } from './LabeledFillPatterns';
import { FillPatternFactory } from '../../../../../core/geo/styles/FillPatternFactory';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { connect, ConnectedProps } from 'react-redux';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import { Modal } from 'react-bootstrap';
import FillPatternButton from './FillPatternButton';
import OptionRow from '../option-row/OptionRow';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const mapStateToProps = (state: MainState) => ({
  fill: state.map.currentStyle.fill,
});

const mapDispatchToProps = {
  setPattern: MapActions.setFillPattern,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

interface State {
  patternFactory: FillPatternFactory;
  modal: boolean;
}

const t = prefixedTranslation('MapView:ToolSelector.');

class FillPatternSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      patternFactory: new FillPatternFactory(),
      modal: false,
    };
  }

  public render(): ReactNode {
    const pattern = this.props.fill.pattern;
    const color1 = this.props.fill.color1;
    const color2 = this.props.fill.color2;
    const modal = this.state.modal;

    return (
      <>
        {/* Button, always visible */}
        <OptionRow>
          <div>{t('Texture_style')}:</div>
          <FillPatternButton width={40} height={40} pattern={pattern} color1={color1} color2={color2} onClick={this.showModal} />
        </OptionRow>

        {/* Modal, visible on demand */}
        <Modal show={modal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{t('Textures')}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={'p-2'}>{this.getPatternButtons()}</Modal.Body>
        </Modal>
      </>
    );
  }

  private showModal = () => {
    this.setState({ modal: true });
  };

  private closeModal = () => {
    this.setState({ modal: false });
  };

  private getPatternButtons(): ReactNode[] {
    const color1 = this.props.fill?.color1 || 'white';
    const color2 = this.props.fill?.color2 || 'black';
    return LabeledFillPatterns.All.map((item) => {
      return (
        <div className={'d-flex align-items-center m-3'} key={item.value}>
          <FillPatternButton onClick={this.handleSelection} pattern={item.value} color1={color1} color2={color2} width={65} height={65} />
          <div className={'ml-3'}>{t(item.i18nLabel)}</div>
        </div>
      );
    });
  }

  private handleSelection = (pattern: FillPatterns) => {
    const { geo } = this.props.services;

    this.props.setPattern(pattern);
    this.setState({ modal: false });

    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        fill: {
          ...style.fill,
          pattern,
        },
      };
    });
  };
}

export default withTranslation()(connector(withServices(FillPatternSelector)));
