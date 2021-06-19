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
import { newParameters, Parameters, PointType } from '../Parameters';
import FoldableCard from '../../../components/foldable-card/FoldableCard';
import { ServiceProps, withServices } from '../../../core/withServices';
import SymbolConfigForm, { SymbolConfigFormValues } from './SymbolConfigForm';
import DataSourceForm, { DataSourceFormValues } from '../../_common/DataSourceForm';
import GeometryLayerForm, { GeometryLayerFormValues } from '../../_common/GeometryLayerForm';
import { ScaleAlgorithm } from '../../_common/algorithm/Algorithm';
import Cls from './ProportionalSymbolsUi.module.scss';
import Sample from './sample.png';
import { ProportionalSymbolsTips } from '@abc-map/user-documentation';

const logger = Logger.get('ProportionalSymbolsUi.tsx');

interface Props extends ServiceProps {
  initialValue: Parameters;
  onChange: (params: Parameters) => void;
  onProcess: () => Promise<void>;
}

interface State {
  params: Parameters;
  message?: string;
}

class ProportionalSymbolsUi extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { params: this.props.initialValue };
  }

  public render(): ReactNode {
    const params = this.state.params;
    const message = this.state.message;

    const configValues: SymbolConfigFormValues = {
      layerName: params.newLayerName || '',
      type: params.points.type || PointType.Circle,
      sizeMin: params.points.sizeMin || 10,
      sizeMax: params.points.sizeMax || 100,
      algorithm: params.points.algorithm || ScaleAlgorithm.Absolute,
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
              <p>Les symboles proportionnels permettent de représenter des données statistiques absolues (population, budgets annuels, etc ...)</p>
              <p>Comment ça marche ?</p>
              <ul>
                <li>
                  Sélectionnez une source de données et un champ de valeur. C&apos;est ce champ qui déterminera la taille des symboles. Par exemple, un
                  &nbsp;classeur CSV contenant la population française par département et le champ <code>population_2011</code> contenant les données de
                  &nbsp;population.
                </li>
                <li>Sélectionnez une couche de géométries. Les géométries détermineront la position de chaque symbole.</li>
                <li>Sélectionner un champ de jointure entre les données et les géométries.</li>
              </ul>
            </div>
            <img src={Sample} alt={'Exemple de carte'} className={Cls.sample} />
          </div>
        </FoldableCard>

        {/* Data source selection */}
        <FoldableCard title={'2. Sélectionner une source de données'} className={'section'}>
          <div className={'explanation'}>
            La source de données contient le champ qui déterminera la taille des symboles. La source de données peut être une couche de la carte ou un classeur
            au format CSV.
          </div>
          <DataSourceForm
            valuesFieldLabel={'Taille des symboles à partir de:'}
            valuesFieldTip={ProportionalSymbolsTips.SizeField}
            values={dataSourceValues}
            onChange={this.handleDataSourceChange}
          />
        </FoldableCard>

        {/* Vector layer selection */}
        <FoldableCard title={'3. Sélectionner une couche de géométries'} className={'section'}>
          <div className={'explanation'}>
            La couche de géométries sera utilisée pour déterminer la position des symboles. Dans le cas de polygones, les symboles seront positionnés au centre
            des polygones. Dans le cas de points, les symboles seront positionné sur les points.
          </div>
          <GeometryLayerForm values={geometryLayerValues} onChange={this.handleGeometryLayerChange} />
        </FoldableCard>

        {/* Data processing parameters */}
        <FoldableCard title={'4. Paramètres du traitement'} className={'section'}>
          <div className={'explanation'}>
            Les symboles seront créés dans une nouvelle couche. Leurs tailles seront déterminées par le champs source utilisé, entre la taille minimum et la
            taille maximum spécifiée.
          </div>
          <SymbolConfigForm values={configValues} onChange={this.handleConfigChange} />
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

  private handleConfigChange = (values: SymbolConfigFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      newLayerName: values.layerName,
      points: { ...values },
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
      this.setState({ message: 'Le champ taille est obligatoire.' });
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

    if (!params.points.algorithm) {
      this.setState({ message: "L'algorithme est obligatoire." });
      return false;
    }

    if (!params.points.type) {
      this.setState({ message: 'Le type de symbole est obligatoire.' });
      return false;
    }

    if (!params.points.sizeMin) {
      this.setState({ message: 'La taille minimale est obligatoire est doit être supérieure à zéro.' });
      return false;
    }

    if (!params.points.sizeMax) {
      this.setState({ message: 'La taille maximale est obligatoire est doit être supérieure à zéro.' });
      return false;
    }

    if (params.points.sizeMin >= params.points.sizeMax) {
      this.setState({ message: 'La taille minimale doit être inférieure à la taille maximale.' });
      return false;
    }

    return true;
  }
}

export default withServices(ProportionalSymbolsUi);
