import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { newParameters, Parameters, PointType, ScaleAlgorithm } from '../Parameters';
import FoldableCard from '../../../components/foldable-card/FoldableCard';
import { ServiceProps, withServices } from '../../../core/withServices';
import SymbolConfigForm, { ConfigFormValues } from './SymbolConfigForm';
import DataSourceForm, { DataSourceFormValues } from './DataSourceForm';
import Cls from './ProportionalSymbolsUi.module.scss';
import GeometryLayerForm, { GeometryLayerFormValues } from './GeometryLayerForm';

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

    const configValues: ConfigFormValues = {
      layerName: params.newLayerName || '',
      type: params.points.type || PointType.Circle,
      sizeMin: params.points.sizeMin || 10,
      sizeMax: params.points.sizeMax || 100,
      algorithm: params.points.algorithm || ScaleAlgorithm.Absolute,
    };

    const dataSourceValues: DataSourceFormValues = {
      source: params.data.source,
      sizeField: params.data.sizeField || '',
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
          <div className={'explanation'}>
            <p>
              Le module <b>Symboles Proportionnels</b> vous permet de créer des symboles de tailles variables. Cette représentation est utiles pour représenter
              des données en valeurs absolues.
            </p>
            <p>
              Par exemple vous pouvez comparer la <i>population</i> des régions de France:
            </p>
            <ul>
              <li>La région Occitanie qui a 5 millions d&apos;habitants aura un symbole de taille 50</li>
              <li>La région Ile de France qui a 12 millions d&apos;habitants aura un symbole de taille 120</li>
            </ul>
            <p>
              Vous devez configurer une <i>source de données</i> et une <i>couche de géométrie</i>. Dans notre exemple :
            </p>
            <ul>
              <li>
                La source de données est un classeur CSV qui contient un champ &apos;population&apos; (<i>Champ de taille</i>) et un champ &apos;code&apos; (
                <i>Champ de jointure</i>)
              </li>
              <li>
                La couche de géométrie est une couche qui contient la forme de chaque région (<i>Géométrie</i>), chaque forme ayant un champ &apos;code&apos; (
                <i>Champ de jointure</i>)
              </li>
            </ul>
            <p>
              La source de données est mise en relation avec la couche de géométrie à l&apos;aide du champ de jointure. Chaque symbole aura les caractéristiques
              attachées à la valeur de ce champ. Dans notre exemple le champ &apos;code&apos; est le champs de jointure:
            </p>
            <ul>
              <li>Pour le code &apos;FR-OCC&apos; un symbole de taille 50 sera créé au centre de l&apos;Occitanie</li>
              <li>Pour le code &apos;FR-IDF&apos; un symbole de taille 120 sera créé au centre de l&apos;Ile de France</li>
            </ul>
            <p>
              <b>Attention:</b> les valeurs inférieures à zéro sont ignorées.
            </p>
          </div>
        </FoldableCard>

        {/* Data source selection */}
        <FoldableCard title={'2. Sélectionner une source de données'} className={'section'}>
          <div className={'explanation'}>
            La source de données contient le champ qui déterminera la taille des symboles. La source de données peut être une couche de la carte ou un classeur
            au format CSV.
          </div>
          <DataSourceForm values={dataSourceValues} onChange={this.handleDataSourceChange} />
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
        sizeField: values.sizeField,
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

  private handleConfigChange = (values: ConfigFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      newLayerName: values.layerName,
      points: {
        sizeMin: values.sizeMin,
        sizeMax: values.sizeMax,
        type: values.type,
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

    if (!params.data.sizeField) {
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
