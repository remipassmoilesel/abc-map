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
import { Modal } from 'react-bootstrap';
import { PointIcon, safeGetIcon } from '../../assets/point-icons/PointIcon';
import { IconProcessor } from '../../core/geo/styles/IconProcessor';
import { IconName } from '../../assets/point-icons/IconName';
import { LabeledIconCategories } from './IconCategory';
import { getPreviews, IconPreview } from './previews';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './PointIconPicker.module.scss';
import { IconCategory } from '../../assets/point-icons/IconCategory';

interface Props {
  value: IconName | undefined;
  onChange: (p: IconName) => void;
}

interface State {
  valuePreview?: IconPreview;
  modal: boolean;
  iconPreviews?: Map<IconCategory, IconPreview[]>;
}

const previewColor = '#0094e3';

const t = prefixedTranslation('PointIconPicker:');

class PointIconPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { modal: false };
  }

  public render(): ReactNode {
    const value = this.state.valuePreview;
    const modal = this.state.modal;
    const iconPreviews = this.state.iconPreviews;

    return (
      <>
        {/* Button, always visible */}
        <button onClick={this.handleOpen} className={'btn btn-outline-secondary btn-sm'} data-cy={'point-icon-selector'}>
          {!value && t('Select')}
          {value && <img src={value.preview} alt={value.icon.name} />}
        </button>

        {/* Modal, visible on demand */}
        <Modal show={modal} onHide={this.handleCancel} dialogClassName={Cls.modal}>
          <Modal.Header closeButton>
            <Modal.Title>Icônes</Modal.Title>
          </Modal.Header>
          <Modal.Body className={'d-flex flex-column'}>
            <div className={Cls.viewPort}>
              {!iconPreviews && <h3 className={'d-flex justify-content-center mt-5'}>...</h3>}
              {iconPreviews &&
                LabeledIconCategories.All.map((category) => {
                  return (
                    <div key={category.value} className={Cls.category}>
                      <h1 className={Cls.categoryTitle}>{t(category.i18nLabel)}</h1>
                      <div className={Cls.categoryContent}>
                        {iconPreviews.get(category.value)?.map((icon, idx) => (
                          <button
                            key={icon.icon.name}
                            onClick={() => this.handleSelection(icon.icon)}
                            className={`btn btn-outline-secondary ${Cls.iconPreview}`}
                            data-cy={`${category.value}-${idx}`}
                          >
                            <img src={icon.preview} alt={icon.icon.name} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
    const iconChanged = this.props.value !== prevProps.value;
    if (iconChanged) {
      this.updateSelectedPreview();
    }
  }

  private handleOpen = (): void => {
    // We show modal first
    this.setState({ modal: true }, () => {
      // Then we load previews after modal rendering
      if (!this.state.iconPreviews) {
        setTimeout(() => {
          const iconPreviews = getPreviews();
          this.setState({ iconPreviews });
        }, 200);
      }
    });
  };

  private handleCancel = (): void => {
    this.setState({ modal: false });
  };

  private handleSelection = (icon: PointIcon): void => {
    this.props.onChange(icon.name);
    this.setState({ modal: false });
  };

  private updateSelectedPreview() {
    const iconName = this.props.value;
    if (!iconName) {
      this.setState({ valuePreview: undefined });
      return;
    }

    const icon = safeGetIcon(iconName);
    const preview = IconProcessor.get().prepareCached(icon, 20, previewColor);
    const valuePreview = { icon, preview };
    this.setState({ valuePreview });
  }
}

export default withTranslation()(PointIconPicker);
