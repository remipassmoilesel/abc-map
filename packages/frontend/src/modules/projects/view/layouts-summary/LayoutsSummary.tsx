/**
 * Copyright © 2022 Rémi Pace.
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

import Cls from './LayoutsSummary.module.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAppSelector } from '../../../../core/store/hooks';

interface Props {
  className?: string;
}

export function LayoutsSummary(props: Props) {
  const { className } = props;
  const { t } = useTranslation('ProjectManagement');
  const layouts = useAppSelector((st) => st.project.layouts.list);

  return (
    <>
      {!!layouts.length && (
        <div className={clsx('d-flex flex-column', className)}>
          <div className={'mb-3'}>{t('Layouts')}:</div>

          <table className={Cls.table}>
            <tbody>
              {layouts.map((lay) => (
                <tr key={lay.id}>
                  <td>{lay.name}</td>
                  <td>
                    <small>
                      {lay.format.width} x {lay.format.height} mm
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
