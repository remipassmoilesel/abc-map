/**
 * Copyright © 2023 Rémi Pace.
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
import { useMapLayers } from '../../core/geo/useMapLayers';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useServices } from '../../core/useServices';
import { UiConstants } from '../../core/ui/UiConstants';

interface HeavyLayer {
  name: string;
  features: number;
}

interface Warning {
  type: 'layers-per-map' | 'features-per-layer' | 'total-features';
  content: ReactNode;
  dismissed: boolean;
}

export function HeavyProjectWarning() {
  const { t } = useTranslation('HeavyProjectWarning');
  const { project } = useServices();

  const [warnings, setWarnings] = useState<Warning[]>([]);
  const { layers } = useMapLayers();
  const visible = warnings.filter((warn) => !warn.dismissed).length > 0;

  // Each time layers change we inspect project
  useEffect(() => {
    // We check if there are too many layers
    if (layers.length > UiConstants.LAYERS_PER_MAP_MAX && !warnings.find((warn) => warn.type === 'layers-per-map')) {
      setWarnings((warnings) =>
        warnings.concat({
          type: 'layers-per-map',
          content: (
            <div className={'mb-4'}>
              {t('There_are_a_lot_of_layers', { n: layers.length })} {t('The_recommended_maximum_number_of_layers_is', { max: UiConstants.LAYERS_PER_MAP_MAX })}
            </div>
          ),
          dismissed: false,
        })
      );
    }

    // We check if vector layers are too heavy
    const heavyLayers: HeavyLayer[] = layers
      .filter((layer): layer is VectorLayerWrapper => layer.isVector() && layer.getSource().getFeatures().length > UiConstants.FEATURE_PER_LAYER_MAX)
      .map((layer) => ({ name: layer.getName() ?? '<no-name>', features: layer.getSource().getFeatures().length }));

    if (heavyLayers.length && !warnings.find((warn) => warn.type === 'features-per-layer')) {
      setWarnings((warnings) =>
        warnings.concat({
          type: 'features-per-layer',
          content: (
            <div className={'mb-4'}>
              <div>{t('These_layers_have_too_much_geometry')}</div>
              <ul>
                {heavyLayers.map((layer, i) => (
                  <li key={layer.name + i} className={'ps-2'}>
                    {layer.name} ({layer.features})
                  </li>
                ))}
              </ul>
              <div>{t('The_recommended_maximum_number_of_geometries_per_layer_is', { max: UiConstants.FEATURE_PER_LAYER_MAX })}</div>
            </div>
          ),
          dismissed: false,
        })
      );
    }

    // We check if there is too much features
    const totalFeatures = layers.filter((layer): layer is VectorLayerWrapper => layer.isVector()).reduce((a, b) => b.getSource().getFeatures().length + a, 0);
    if (totalFeatures > UiConstants.FEATURES_PER_PROJECT_MAX && !warnings.find((warn) => warn.type === 'total-features')) {
      setWarnings((warnings) =>
        warnings.concat({
          type: 'total-features',
          content: (
            <div className={'mb-4'}>
              <div>{t('There_are_too_much_geometries_in_your_project', { n: totalFeatures })}</div>
              <div>{t('The_recommended_maximum_number_of_geometries_is', { max: UiConstants.FEATURES_PER_PROJECT_MAX })}</div>
            </div>
          ),
          dismissed: false,
        })
      );
    }
  }, [layers, layers.length, t, warnings]);

  // Each time project change we reset warnings
  useEffect(() => {
    project.addProjectLoadedListener(() => setWarnings([]));
  }, [project]);

  const handleClose = useCallback(() => {
    setWarnings((warnings) => warnings.map((warn) => ({ ...warn, dismissed: true })));
  }, []);

  return (
    <Modal show={visible} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Your_project_is_a_bit_heavy')} 🏋</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'alert alert-warning mb-4'}>
          {t('Your_project_is_a_bit_heavy_If_you_use_a_lot_of_data_you_risk_slowing_down_or_freezing_your_session')}
        </div>

        {warnings.filter((warning) => !warning.dismissed).map((warning) => warning.content)}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose} className={'btn btn-primary'}>
          {t('I_understand')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
