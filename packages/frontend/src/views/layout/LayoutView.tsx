import React, { ChangeEvent, Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import LayoutList from './layout-list/LayoutList';
import { AbcLayout, LayoutFormat, LayoutFormats } from '@abc-map/shared-entities';
import LayoutPreview from './layout-preview/LayoutPreview';
import { jsPDF } from 'jspdf';
import { LayoutHelper } from './LayoutHelper';
import View from 'ol/View';
import { Map } from 'ol';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import './LayoutView.scss';

const logger = Logger.get('LayoutView.tsx', 'warn');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  activeLayout?: AbcLayout;
  format: LayoutFormat;
}

const mapStateToProps = (state: RootState) => ({
  layouts: state.project.current?.layouts || [],
  mainMap: state.map.mainMap,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class LayoutView extends Component<Props, State> {
  private services = services();
  private exportMapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      format: LayoutFormats.A4_PORTRAIT,
    };
  }

  public render(): ReactNode {
    const layouts = this.props.layouts;
    const activeLayout = this.state.activeLayout;
    const formatOptions = LayoutFormats.ALL.map((fmt) => (
      <option key={fmt.name} value={fmt.name}>
        {fmt.name}
      </option>
    ));
    return (
      <div className={'abc-layout-view'}>
        <div className={'content'}>
          <div className={'left-panel'}>
            <LayoutList layouts={layouts} activeLayout={activeLayout} onLayoutSelected={this.onLayoutSelected} />
          </div>
          <LayoutPreview layout={activeLayout} mainMap={this.props.mainMap} onLayoutChanged={this.onLayoutChanged} />
          <div className={'right-panel'}>
            <div className={'control-block form-group'}>
              <button onClick={this.newLayout} className={'btn btn-link'}>
                <i className={'fa fa-file mr-2'} />
                Nouvelle page
              </button>
              <select className={'form-control'} onChange={this.onFormatChange} value={this.state.format.name}>
                {formatOptions}
              </select>
            </div>
            <div className={'control-block'}>
              <div className={'control-item'}>
                <button onClick={this.clearAll} className={'btn btn-link'}>
                  <i className={'fa fa-trash-alt mr-2'} />
                  Supprimer tout
                </button>
              </div>
              <div className={'control-item'}>
                <button onClick={this.exportOneLayout} className={'btn btn-link'}>
                  <i className={'fa fa-download mr-2'} />
                  Exporter la page
                </button>
              </div>
              <div className={'control-item'}>
                <button onClick={this.exportAllLayouts} className={'btn btn-link'}>
                  <i className={'fa fa-download mr-2'} />
                  Exporter tout
                </button>
              </div>
            </div>
            <HistoryControls historyKey={HistoryKey.Layout} />
          </div>
        </div>
        <div ref={this.exportMapRef} />
      </div>
    );
  }

  public componentDidMount() {
    const layouts = this.props.layouts;
    if (layouts.length) {
      this.setState({ activeLayout: layouts[0] });
    } else {
      this.newLayout();
    }
  }

  public newLayout = () => {
    logger.info('Adding new layout');
    const pageNbr = this.props.layouts.length + 1;
    const name = `Page ${pageNbr}`;
    const view = this.props.mainMap.getView();
    const center = view.getCenter();
    const resolution = view.getResolution();
    if (!center || !resolution) {
      return logger.error('Resolution or center not found');
    }

    // Here we make an estimation of resolution as we can't know main map size
    const layoutRes = Math.round(resolution - resolution * 0.2);
    const layout = this.services.project.newLayout(name, this.state.format, center, layoutRes, view.getProjection().getCode());
    this.setState({ activeLayout: layout });
  };

  public clearAll = () => {
    this.services.project.clearLayouts();
    this.setState({ activeLayout: undefined });
  };

  public onLayoutSelected = (lay: AbcLayout) => {
    this.setState({ activeLayout: lay });
  };

  public onFormatChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const format = LayoutFormats.ALL.find((fmt) => fmt.name === value);
    if (!format) {
      return logger.error(`Format not found: ${value}`);
    }
    this.setState({ format });
  };

  public onLayoutChanged = (layout: AbcLayout) => {
    this.services.project.updateLayout(layout);
    if (layout.id === this.state.activeLayout?.id) {
      this.setState({ activeLayout: layout });
    }
  };

  public exportOneLayout = () => {
    const layout = this.state.activeLayout;
    const support = this.exportMapRef.current;
    if (!layout) {
      return this.services.toasts.error('Vous devez créer une mise en page');
    }
    if (!support) {
      this.services.toasts.genericError();
      return logger.error('Support or layout not ready');
    }

    this.services.toasts.info("Début de l'export ...");
    const pdf = new jsPDF();
    const exportMap = this.services.map.newNakedMap();
    exportMap.setTarget(support);

    this.exportLayout(layout, pdf, support, this.props.mainMap, exportMap)
      .then(() => {
        pdf.save('map.pdf');
        exportMap.dispose();
        this.services.toasts.info('Export terminé !');
      })
      .catch((err) => logger.error(err));
  };

  public exportAllLayouts = () => {
    this.services.toasts.info("Début de l'export ...");
    const layouts = this.props.layouts;
    const support = this.exportMapRef.current;
    if (!support) {
      this.services.toasts.genericError();
      return logger.error('Support or layouts not ready');
    }
    if (!layouts.length) {
      return this.services.toasts.error('Vous devez créer une mise en page');
    }

    const pdf = new jsPDF();
    const exportMap = this.services.map.newNakedMap();
    exportMap.setTarget(support);

    (async () => {
      for (const layout of layouts) {
        const format = layout.format;
        const index = layouts.indexOf(layout);
        logger.warn('index', index);
        if (index !== 0) {
          pdf.addPage([format.width, format.height], format.orientation);
        }
        await this.exportLayout(layout, pdf, support, this.props.mainMap, exportMap);
      }
    })()
      .then(() => {
        pdf.save('map.pdf');
        this.services.toasts.info('Export terminé !');
      })
      .catch((err) => {
        this.services.toasts.genericError();
        logger.error(err);
      })
      .finally(() => {
        exportMap.dispose();
      });
  };

  private exportLayout = (layout: AbcLayout, pdf: jsPDF, support: HTMLDivElement, sourceMap: Map, exportMap: Map): Promise<void> => {
    logger.info('Exporting layout: ', layout);
    return new Promise<void>((resolve, reject) => {
      const format = layout.format;
      const dimension = LayoutHelper.layoutToPixel(layout);

      // We adapt size of map to layout
      support.style.marginTop = '200px';
      support.style.width = `${dimension.width}px`;
      support.style.height = `${dimension.height}px`;
      exportMap.updateSize();

      // We copy layers from sourceMap to exporMap
      this.services.map.cloneLayers(this.props.mainMap, exportMap);

      const viewResolution = exportMap.getView().getResolution();
      if (!viewResolution) {
        return reject(new Error('ViewResolution not available'));
      }

      // Then we export layers on render complete
      exportMap.once('rendercomplete', () => {
        logger.info('Rendering layout: ', layout);
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = dimension.width;
        mapCanvas.height = dimension.height;
        const ctx = mapCanvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('ViewResolution not available'));
        }

        // We paint a white rectangle as background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, dimension.width, dimension.height);

        const layers = support.querySelectorAll('.ol-layer canvas');
        layers.forEach((layer) => {
          if (!(layer instanceof HTMLCanvasElement)) {
            return reject(new Error(`Bad element selected: ${layer.constructor.name}`));
          }
          if (!ctx) {
            return reject(new Error('Canvas context not available'));
          }

          if (layer.width > 0) {
            const opacity = (layer.parentNode as HTMLElement)?.style.opacity || '';
            ctx.globalAlpha = opacity === '' ? 1 : Number(opacity);

            // Get the transform parameters from the style's transform matrix
            const transform = layer.style.transform.match(/^matrix\(([^(]*)\)$/);
            if (transform) {
              const args = transform[1].split(',').map(Number) as number[];
              ctx.setTransform(args[0], args[1], args[2], args[3], args[4], args[5]);
            }

            ctx.drawImage(layer, 0, 0);
          }
        });

        pdf.addImage(mapCanvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, format.width, format.height);
        resolve();
      });

      // We set view and trigger render
      exportMap.setView(
        new View({
          center: layout.view.center,
          resolution: layout.view.resolution,
          projection: layout.view.projection,
        })
      );
    });
  };
}

export default connector(LayoutView);
