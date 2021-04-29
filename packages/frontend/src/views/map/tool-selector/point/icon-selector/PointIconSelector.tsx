import React, { Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import { Modal } from 'react-bootstrap';
import { getAllIcons, safeGetIcon, PointIcon } from '../../../../../core/geo/style/PointIcons';
import { IconProcessor } from '../../../../../core/geo/style/IconProcessor';
import Cls from './PointIconSelector.module.scss';

interface IconPreview {
  icon: PointIcon;
  preview: HTMLImageElement;
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

const previewColor = '#005de2';

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
      <div className={'control-item d-flex align-items-center justify-content-between'}>
        <div className={'mr-2'}>Icône: </div>
        <button onClick={this.handleOpen} className={'btn btn-outline-secondary btn-sm'}>
          {!selected && 'Choisir'}
          {selected && <img src={selected.preview.src} alt={selected.icon.name} />}
        </button>

        <Modal show={modal} onHide={this.handleCancel} size={'lg'} className={Cls.modal}>
          <Modal.Header closeButton>
            <Modal.Title>Icônes</Modal.Title>
          </Modal.Header>
          <Modal.Body className={'d-flex flex-column'}>
            <div className={Cls.viewPort}>
              {iconPreviews.map((i) => (
                <img
                  key={i.icon.name}
                  src={i.preview.src}
                  onClick={() => this.handleSelection(i.icon)}
                  className={`btn btn-outline-secondary ${Cls.iconPreview}`}
                  alt={i.icon.name}
                />
              ))}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  public componentDidMount() {
    this.updateSelectedPreview();
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.point?.icon !== prevProps.point?.icon) {
      this.updateSelectedPreview();
    }
  }

  private handleOpen = (): void => {
    // If not already done, we prepare icon previews
    if (!this.state.iconPreviews.length) {
      const icons = getAllIcons().map((i) => {
        return { icon: i, preview: IconProcessor.prepare(i, 50, previewColor) };
      });
      this.setState({ iconPreviews: icons, modal: true });
    } else {
      this.setState({ modal: true });
    }
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

    const icon = safeGetIcon(iconName);
    const preview = IconProcessor.prepare(icon, 20, previewColor);
    const selectedPreview: IconPreview = { icon, preview };
    this.setState({ selectedPreview });
  }
}

export default connector(withServices(PointIconSelector));
