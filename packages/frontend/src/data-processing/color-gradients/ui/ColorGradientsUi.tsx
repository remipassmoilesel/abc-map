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
import { newParameters, Parameters } from '../Parameters';
import FoldableCard from '../../../components/foldable-card/FoldableCard';
import { ServiceProps, withServices } from '../../../core/withServices';
import DataSourceForm, { DataSourceFormValues } from '../../_common/DataSourceForm';
import { ClassificationAlgorithm } from '../../_common/algorithm/Algorithm';
import GradientsConfigForm, { ColorsConfigFormValues } from './GradientsConfigForm';
import GeometryLayerForm, { GeometryLayerFormValues } from '../../_common/GeometryLayerForm';
import Sample from './sample.png';
import { ColorGradientTips } from '@abc-map/user-documentation';
import Cls from './ColorGradientsUi.module.scss';

const logger = Logger.get('ColorGradientsUI.tsx');

interface Props extends ServiceProps {
  initialValue: Parameters;
  onChange: (params: Parameters) => void;
  onProcess: () => Promise<void>;
}

interface State {
  params: Parameters;
  message?: string;
}

class ColorGradientsUI extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { params: this.props.initialValue };
  }

  public render(): ReactNode {
    const params = this.state.params;
    const message = this.state.message;

    const configValues: ColorsConfigFormValues = {
      layerName: params.newLayerName || '',
      start: params.colors.start || '#ffffff',
      end: params.colors.end || '#000000',
      algorithm: params.colors.algorithm || ClassificationAlgorithm.NaturalBreaks,
      classes: params.colors.classes || [],
    };

    const dataSourceValues: DataSourceFormValues = {
      source: params.data.source,
      valueField: params.data.valueField || '',
      joinBy: params.data.joinBy || '',
    };

    const geometryLayerValues: GeometryLayerFormValues = {
      layer: params.geometries.layer,
      joinBy: params.geometries.joinBy || '',
    };

    return (
      <div className={Cls.panel}>
        {/* Module introduction */}
        <FoldableCard title={'1. Introduction'} className={'section'}>
          <div className={'explanation d-flex flex-row justify-content-between align-items-start'}>
            <div className={Cls.introduction}>
              <p>
                Les dégradés de couleurs permettent de représenter des données statistiques relatives (densité de population, revenus par habitants, etc ...)
              </p>
              <p>Comment ça marche ?</p>
              <ul>
                <li>
                  Sélectionnez une source de données et un champ de valeur. C&apos;est ce champ qui sera utilisé pour déterminer les couleurs. Par exemple, un
                  &nbsp;classeur CSV contenant la population française par département et le champ <code>densite_pop</code> contenant les données de densité.
                </li>
                <li>Sélectionnez une couche de géométries. Les géométries seront dupliquées et remplies avec la couleur calculée.</li>
                <li>Sélectionner un champ de jointure entre les données et les géométries.</li>
              </ul>
            </div>
            <img src={Sample} alt={'Exemple de carte'} className={Cls.sample} />
          </div>
        </FoldableCard>

        {/* Data source selection */}
        <FoldableCard title={'2. Sélectionner une source de données'} className={'section'}>
          <div className={'explanation'}>
            La source de données contient le champ qui déterminera les couleurs des géométries. La source de données peut être une couche de la carte ou
            &nbsp;un classeur au format CSV.
          </div>
          <DataSourceForm
            valuesFieldLabel={'Couleurs à partir de:'}
            valuesFieldTip={ColorGradientTips.ColorField}
            values={dataSourceValues}
            onChange={this.handleDataSourceChange}
          />
        </FoldableCard>

        {/* Vector layer selection */}
        <FoldableCard title={'3. Sélectionner une couche de géométries'} className={'section'}>
          <div className={'explanation'}>Les couleurs seront appliquées à une copie des géométries de la couche sélectionnée.</div>
          <GeometryLayerForm values={geometryLayerValues} onChange={this.handleGeometryLayerChange} />
        </FoldableCard>

        {/* Data processing parameters */}
        <FoldableCard title={'4. Paramètres du traitement'} className={'section'}>
          <div className={'explanation'}>
            Les couleurs seront créés dans une nouvelle couche. Leurs valeurs seront déterminées par le champs source utilisé, et par le type d&apos;algorithme.
          </div>
          {!dataSourceValues.valueField && <div>Vous devez choisir un champ de valeur.</div>}
          {!dataSourceValues.source && <div>Vous devez choisir une source de données.</div>}
          {dataSourceValues.valueField && dataSourceValues.source && (
            <GradientsConfigForm
              values={configValues}
              valueField={dataSourceValues.valueField}
              dataSource={dataSourceValues.source}
              onChange={this.handleConfigChange}
            />
          )}
        </FoldableCard>

        {message && <div className={'m-3 font-weight-bold d-flex justify-content-end'}>{message}</div>}

        <div className={'d-flex flex-row justify-content-end'}>
          <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
            Réinitialiser
          </button>
          <button className={'btn btn-primary mr-3'} onClick={this.handleSubmit} data-cy={'process'}>
            Lancer le traitement
          </button>
        </div>
      </div>
    );
  }

  private handleDataSourceChange = (values: DataSourceFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      data: {
        source: values.source,
        valueField: values.valueField,
        joinBy: values.joinBy,
      },
    };

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleGeometryLayerChange = (values: GeometryLayerFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      geometries: {
        layer: values.layer,
        joinBy: values.joinBy,
      },
    };

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleConfigChange = (values: ColorsConfigFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      newLayerName: values.layerName,
      colors: {
        classes: values.classes,
        start: values.start,
        end: values.end,
        algorithm: values.algorithm,
      },
    };

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleCancel = () => {
    const params: Parameters = newParameters();

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleSubmit = () => {
    const { toasts } = this.props.services;

    const isValid = this.validateParameters();
    if (!isValid) {
      return;
    }

    this.props
      .onProcess()
      .then(() => toasts.info('Traitement terminé !'))
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  // TODO: replace with formstate ?
  private validateParameters(): boolean {
    const params = this.state.params;

    if (!params.newLayerName) {
      this.setState({ message: 'Le nom de la couche est obligatoire.' });
      return false;
    }

    if (!params.data.source) {
      this.setState({ message: 'La source de données est obligatoire.' });
      return false;
    }

    if (!params.data.valueField) {
      this.setState({ message: 'Le champ valeur est obligatoire.' });
      return false;
    }

    if (!params.data.joinBy) {
      this.setState({ message: 'Le champ jointure de la source de données est obligatoire.' });
      return false;
    }

    if (!params.geometries.layer) {
      this.setState({ message: 'La couche de géométries est obligatoire.' });
      return false;
    }

    if (!params.geometries.joinBy) {
      this.setState({ message: 'Le champ jointure de la couche de géométries est obligatoire.' });
      return false;
    }

    if (!params.colors.algorithm) {
      this.setState({ message: "L'algorithme est obligatoire." });
      return false;
    }

    if (!params.colors.start) {
      this.setState({ message: 'La couleur de début est obligatoire.' });
      return false;
    }

    if (!params.colors.end) {
      this.setState({ message: 'La couleur de fin est obligatoire.' });
      return false;
    }

    return true;
  }
}

export default withServices(ColorGradientsUI);
