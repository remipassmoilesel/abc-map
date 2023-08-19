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

import Cls from './SharedViewsSummary.module.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAppSelector } from '../../../../core/store/hooks';
import { useMapLayers } from '../../../../core/geo/useMapLayers';

interface Props {
  className?: string;
}

export function SharedViewsSummary(props: Props) {
  const { className } = props;
  const { t } = useTranslation('ProjectManagement');
  const views = useAppSelector((st) => st.project.sharedViews.list);
  const { layers } = useMapLayers();

  return (
    <>
      {!!views.length && (
        <div className={clsx('d-flex flex-column', className)}>
          <div className={'mb-3'}>{t('Shared_views')}:</div>

          <table className={Cls.table}>
            <tbody>
              {views.map((view) => {
                const layerNames = view.layers.map((layA) => layers.find((layB) => layB.getId() === layA.layerId)).map((lay) => lay?.getName());
                return (
                  <tr key={view.id}>
                    <td>{view.title}</td>
                    <td>
                      <small>
                        {view.layers.length} {t('Layers')} ({layerNames.join(', ')})
                      </small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
