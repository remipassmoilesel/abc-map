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

import Cls from './LayersSummary.module.scss';
import { FaIcon } from '../../../../components/icon/FaIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { layerIcon, layerTypeName } from './helpers';
import clsx from 'clsx';
import { useMapLayers } from '../../../../core/geo/useMapLayers';

interface Props {
  className?: string;
}

export function LayersSummary(props: Props) {
  const { className } = props;
  const { t } = useTranslation('ProjectManagement');
  const { layers } = useMapLayers();

  return (
    <>
      {!!layers?.length && (
        <div className={clsx('d-flex flex-column', className)}>
          <div className={'mb-3'}>{t('Layers')}:</div>

          <table className={Cls.table}>
            <tbody>
              {layers?.map((lay) => (
                <tr key={lay.getId()}>
                  <td>
                    <FaIcon icon={layerIcon(lay.getType())} className={'mr-2'} /> {lay.getName()}
                  </td>
                  <td>
                    <small>
                      {t('Type')} {layerTypeName(lay.getType())}
                    </small>
                  </td>
                  <td>{lay.isVector() && <small className={'ml-3'}>{`${lay.getSource().getFeatures().length} ${t('Features')}`}</small>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
