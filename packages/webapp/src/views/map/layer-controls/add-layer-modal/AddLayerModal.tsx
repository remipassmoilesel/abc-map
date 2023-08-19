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

import React, { ChangeEvent, useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { LabeledLayerType, LabeledLayerTypes } from './_common/LabeledLayerTypes';
import WmsLayerPanel from './wms/WmsLayerPanel';
import { Logger, PredefinedLayerModel } from '@abc-map/shared';
import PredefinedPanel from './predefined/PredefinedLayerPanel';
import XYZLayerPanel from './xyz/XYZLayerPanel';
import Cls from './AddLayerModal.module.scss';
import GeometryLayerPanel from './geometry/GeometryLayerPanel';
import HelpPanel from './help-panel/HelpPanel';
import WmtsLayerPanel from './wmts/WmtsLayerPanel';
import { WmsSettings, WmtsSettings } from '../../../../core/geo/layers/LayerFactory.types';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { EmptyWmsValues, EmptyWmtsValues } from './AddLayerModal.empty-values';
import { useAppSelector } from '../../../../core/store/hooks';

const logger = Logger.get('AddLayerModal.tsx');
const t = prefixedTranslation('MapView:');

interface Props {
  visible: boolean;
  onHide: () => void;
}

function AddLayerModal(props: Props) {
  const { onHide, visible } = props;
  const projection = useAppSelector((st) => st.project.mainView.projection);
  const [layerType, setLayerType] = useState<LabeledLayerType>(LabeledLayerTypes.Predefined);

  const [predefinedValues, setPredefinedValues] = useState<PredefinedLayerModel>(PredefinedLayerModel.StamenWatercolor);
  const [wmsValues, setWmsValues] = useState<WmsSettings>(EmptyWmsValues);
  const [wmtsValues, setWmtsValues] = useState<WmtsSettings>(EmptyWmtsValues);
  const [xyzValues, setXyzValues] = useState<string>('');

  const predefinedSelected = layerType.id === LabeledLayerTypes.Predefined.id;
  const geometrySelected = layerType.id === LabeledLayerTypes.Vector.id;
  const xyzSelected = layerType.id === LabeledLayerTypes.Xyz.id;
  const wmsSelected = layerType.id === LabeledLayerTypes.Wms.id;
  const wmtsSelected = layerType.id === LabeledLayerTypes.Wmts.id;

  const handleLayerTypeChange = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const layerType = LabeledLayerTypes.find(value);
    if (!layerType) {
      logger.error('Invalid type: ', value);
      return;
    }

    setLayerType(layerType);
  }, []);

  const handleWmsValuesChange = useCallback((wms: WmsSettings) => setWmsValues(wms), []);
  const handleWmtsValuesChange = useCallback((wmts: WmtsSettings) => setWmtsValues(wmts), []);
  const handleXyzValuesChange = useCallback((xyzUrl: string) => setXyzValues(xyzUrl), []);
  const handlePredefinedValueChanged = useCallback((predefinedModel: PredefinedLayerModel) => setPredefinedValues(predefinedModel), []);

  if (!visible) {
    return <div />;
  }

  return (
    <Modal show={true} onHide={onHide} size={'xl'} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('New_layer')} 🗺️</Modal.Title>
      </Modal.Header>
      <Modal.Body className={Cls.modal}>
        {/* Selector and advice on left*/}
        <div className={Cls.leftPanel}>
          <div className={Cls.subTitle}>{t('What_kind_of_layer')}</div>

          <select value={layerType.id} onChange={handleLayerTypeChange} className={'form-select'} data-cy={'add-layer-type'}>
            {LabeledLayerTypes.All.map((type) => (
              <option key={type.id} value={type.id}>
                {t(type.i18nLabel)}
              </option>
            ))}
          </select>

          <HelpPanel type={layerType.id} />
        </div>

        {/* Settings on right */}
        <div className={Cls.rightPanel}>
          <div className={Cls.subTitle}>{t('Parameters')}</div>

          {predefinedSelected && <PredefinedPanel value={predefinedValues} onChange={handlePredefinedValueChanged} onCancel={onHide} onConfirm={onHide} />}
          {geometrySelected && <GeometryLayerPanel onConfirm={onHide} onCancel={onHide} />}
          {xyzSelected && <XYZLayerPanel url={xyzValues} onChange={handleXyzValuesChange} onCancel={onHide} onConfirm={onHide} />}
          {wmsSelected && <WmsLayerPanel projection={projection} value={wmsValues} onChange={handleWmsValuesChange} onCancel={onHide} onConfirm={onHide} />}
          {wmtsSelected && <WmtsLayerPanel value={wmtsValues} onChange={handleWmtsValuesChange} onCancel={onHide} onConfirm={onHide} />}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default withTranslation()(AddLayerModal);
