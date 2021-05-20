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
import { Logger } from '@abc-map/shared';
import { FileIO, InputResultType, InputType } from '../../core/utils/FileIO';
import { ServiceProps, withServices } from '../../core/withServices';
import { LayerChangeHandler } from '../../core/geo/map/MapWrapper';
import VectorLayerSelector from '../vector-layer-selector/VectorLayerSelector';
import { DataSource, DataSourceType } from '../../core/data/data-source/DataSource';
import { LayerDataSource } from '../../core/data/data-source/LayerDataSource';
import { FileDataSource } from '../../core/data/data-source/FileDataSource';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { CsvParsingError } from '../../core/data/csv-parser/typings';
import Cls from './DataSourceSelector.module.scss';

const logger = Logger.get('DataSourceSelector.tsx');

interface Props extends ServiceProps {
  value?: DataSource;
  onSelected: (source: DataSource | undefined) => void;
}

interface State {
  display: Display;
  layerChangeHandler?: LayerChangeHandler;
  message?: string;
}

enum Display {
  Layers = 'Layers',
  File = 'File',
}

class DataSourceSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { display: Display.Layers };
  }

  public render(): ReactNode {
    const source = this.props.value;
    const display = this.state.display;
    const message = this.state.message;

    return (
      <div className={Cls.dataSourceSelector}>
        <div className={'d-flex mb-3'}>
          <div className={Cls.displayControl} onClick={() => this.handleDisplayClick(Display.Layers)} data-cy={'data-source-layer'}>
            <input type={'radio'} name={'display'} value={Display.Layers} checked={display === Display.Layers} readOnly />
            Choisir une couche
          </div>
          <div className={Cls.displayControl} onClick={() => this.handleDisplayClick(Display.File)} data-cy={'data-source-file'}>
            <input type={'radio'} name={'display'} value={Display.File} checked={display === Display.File} readOnly />
            Importer un fichier CSV
          </div>
        </div>

        <div className={'mb-3'}>
          {display === Display.Layers && (
            <div className={Cls.selectVectorLayer}>
              <VectorLayerSelector onSelected={this.handleLayerSelected} value={source?.getId()} />
            </div>
          )}

          {display === Display.File && (
            <div className={Cls.selectFile}>
              <div>
                Cliquez sur &apos;Importer&apos; pour sélectionnez un fichier sur votre ordinateur. Ce fichier doit :
                <ul className={'mt-2'}>
                  <li>Être au format CSV: séparateur virgule, guillemets doubles, encodage UTF-8</li>
                  <li>Avoir une ligne d&apos;en-tête avec le nom des colonnes</li>
                </ul>
              </div>
              <div className={'d-flex'}>
                <button onClick={this.handleImportFile} className={'btn btn-primary'} data-cy={'data-source-import-file'}>
                  Importer un fichier CSV
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={'mb-3'}>
          {source && (
            <>
              <span>Source sélectionnée:</span> <b>{source.getName()}</b>.&nbsp;
            </>
          )}
          {message && `${message} `}
        </div>
      </div>
    );
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.value?.getId() !== prevProps.value?.getId()) {
      const value = this.props.value;
      const display = value?.getType() && value?.getType() === DataSourceType.CsvFile ? Display.File : Display.Layers;
      this.setState({ display });
      value && this.selectSource(value);
    }
  }

  private handleDisplayClick = (display: Display) => {
    this.setState({ display });
  };

  private handleLayerSelected = (layer: VectorLayerWrapper | undefined) => {
    if (!layer) {
      this.props.onSelected(undefined);
      return;
    }

    this.selectSource(new LayerDataSource(layer));
  };

  private handleImportFile = () => {
    const { toasts } = this.props.services;

    FileIO.openInput(InputType.Single, '.csv')
      .then((res) => {
        if (res.type === InputResultType.Confirmed) {
          this.selectSource(new FileDataSource(res.files[0]));
        }
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  private selectSource(source: DataSource): void {
    // First we check that data source is valid
    source
      .getRows()
      .then((rows) => {
        if (rows.length >= 500) {
          this.setState({ message: `Attention: cette source contient beaucoup de données (${rows.length}), le traitement sera long.` });
        } else if (rows.length === 0) {
          this.setState({ message: 'Cette source de données est vide' });
        } else {
          this.setState({ message: `${rows.length} entrées seront traitées` });
        }
        this.props.onSelected(source);
      })
      .catch((err: CsvParsingError | Error) => {
        logger.error('Data source error: ', err);
        if ('row' in err) {
          this.setState({ message: `Le contenu de ce fichier ne peut pas être lu, une erreur est survenue à la ligne ${err.row}` });
        } else {
          this.setState({ message: 'Cette source de données est incorrecte, sélectionnez en une autre' });
        }
      });
  }
}

export default withServices(DataSourceSelector);
