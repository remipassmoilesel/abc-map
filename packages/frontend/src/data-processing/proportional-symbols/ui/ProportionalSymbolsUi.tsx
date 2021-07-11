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
import SymbolConfigForm, { SymbolConfigFormValues } from './SymbolConfigForm';
import DataSourceForm, { DataSourceFormValues } from '../../_common/data-source-form/DataSourceForm';
import GeometryLayerForm, { GeometryLayerFormValues } from '../../_common/geometry-layer-form/GeometryLayerForm';
import { ScaleAlgorithm } from '../../_common/algorithm/Algorithm';
import Cls from './ProportionalSymbolsUi.module.scss';
import Sample from './sample.png';
import { ProportionalSymbolsTips } from '@abc-map/user-documentation';
import FormValidationLabel from '../../../components/form-validation-label/FormValidationLabel';
import { FormState } from '../../../components/form-validation-label/FormState';

const logger = Logger.get('ProportionalSymbolsUi.tsx');

interface Props extends ServiceProps {
  initialValue: Parameters;
  onChange: (params: Parameters) => void;
  onProcess: () => Promise<void>;
}

interface State {
  params: Parameters;
  formState?: FormState;
}

class ProportionalSymbolsUi extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { params: this.props.initialValue };
  }

  public render(): ReactNode {
    const params = this.state.params;
    const formState = this.state.formState;

    const dataSourceValues: DataSourceFormValues = {
      source: params.data.source,
      valueField: params.data.valueField,
      joinBy: params.data.joinBy,
    };

    const geometryLayerValues: GeometryLayerFormValues = {
      layer: params.geometries.layer,
      joinBy: params.geometries.joinBy,
    };

    const configValues: SymbolConfigFormValues = {
      layerName: params.newLayerName,
      type: params.symbols.type,
      color: params.symbols.color,
      sizeMin: params.symbols.sizeMin,
      sizeMax: params.symbols.sizeMax,
      algorithm: params.symbols.algorithm || ScaleAlgorithm.Absolute,
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
                <li>Ensuite sélectionnez les caractéristiques des points à créer.</li>
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
            Les symboles seront créés dans une nouvelle couche. Leurs tailles seront déterminées par le champ source utilisé, entre la taille minimum et la
            taille maximum spécifiée.
          </div>
          <SymbolConfigForm values={configValues} onChange={this.handleConfigChange} />
        </FoldableCard>

        {formState && (
          <div className={'m-3 d-flex justify-content-end'}>
            <FormValidationLabel state={formState} />
          </div>
        )}

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
      symbols: { ...values },
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
    const { toasts, modals } = this.props.services;

    const formState = this.validateParameters();
    this.setState({ formState });
    if (formState !== FormState.Ok) {
      return;
    }

    modals
      .longOperationModal(this.props.onProcess)
      .then(() => toasts.info('Traitement terminé !'))
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  private validateParameters(): FormState {
    const params = this.state.params;

    if (!params.newLayerName) {
      return FormState.MissingNewLayerName;
    }

    if (!params.data.source) {
      return FormState.MissingDataSource;
    }

    if (!params.data.valueField) {
      return FormState.MissingSymbolValueField;
    }

    if (!params.data.joinBy) {
      return FormState.MissingDataJoinBy;
    }

    if (!params.geometries.layer) {
      return FormState.MissingGeometryLayer;
    }

    if (!params.geometries.joinBy) {
      return FormState.MissingGeometryJoinBy;
    }

    if (!params.symbols.algorithm) {
      return FormState.MissingAlgorithm;
    }

    if (!params.symbols.type) {
      return FormState.MissingSymbolType;
    }

    if (!params.symbols.sizeMin) {
      return FormState.MissingSizeMin;
    }

    if (!params.symbols.sizeMax) {
      return FormState.MissingSizeMax;
    }

    if (params.symbols.sizeMin >= params.symbols.sizeMax) {
      return FormState.InvalidSizeMinMax;
    }

    return FormState.Ok;
  }
}

export default withServices(ProportionalSymbolsUi);
