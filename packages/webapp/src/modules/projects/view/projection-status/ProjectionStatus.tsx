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

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../core/store/hooks';
import clsx from 'clsx';
import { getLang } from '../../../../i18n/i18n';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useServices } from '../../../../core/useServices';
import { DEFAULT_PROJECTION, Language, Logger } from '@abc-map/shared';
import View from 'ol/View';
import { Views } from '../../../../core/geo/Views';
import { ModalStatus } from '../../../../core/ui/typings';
import { GeoServiceErrors } from '../../../../core/geo/GeoServiceErrors';

const logger = Logger.get('ProjectionStatus.tsx');

interface Props {
  className: string;
}

export function ProjectionStatus(props: Props) {
  const { className } = props;
  const { t } = useTranslation('ProjectManagement');
  const { geo, project, modals, toasts } = useServices();
  const mainView = useAppSelector((st) => st.project.mainView);
  const mainMap = geo.getMainMap();
  const layouts = useAppSelector((st) => st.project.layouts.list);
  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);

  // As we are not migrating anything at the moment, we do not allow projection changes
  // if there is anything to migrate.
  const hasVectorLayers = !!mainMap.getLayers().find((l) => l.isVector());
  const hasLayouts = !!layouts.length;
  const hasSharedViews = !!sharedViews.length;
  const changesDisabled = hasVectorLayers || hasLayouts || hasSharedViews;

  let link: string;
  switch (getLang()) {
    case Language.French:
      link = 'https://fr.wikipedia.org/wiki/Syst%C3%A8me_de_coordonn%C3%A9es_(cartographie)';
      break;
    default:
      link = 'https://en.wikipedia.org/wiki/Spatial_reference_system';
  }

  const updateProjection = useCallback(
    async (projectionCode: string) => {
      const update = async () => {
        // We update project and view, and we reset rotation
        const extent = await geo.loadProjection(projectionCode);
        const newView = new View({ projection: projectionCode, rotation: 0 });
        newView.fit(extent);

        geo.getMainMap().unwrap().setView(newView);
        project.setView(Views.olToAbc(newView));
      };

      return update().catch((err) => {
        if (GeoServiceErrors.isProjectionNotFound(err)) {
          toasts.error(t('Unhandled_projection'));
          return;
        }

        return Promise.reject(err);
      });
    },
    [geo, project, t, toasts]
  );

  const handleChangeProjection = useCallback(() => {
    modals
      .prompt(t('Change_projection'), t('Enter_the_new_projection_code'), mainView.projection.name, /(EPSG|WGS):[0-9]+/gi, t('Invalid_projection_code'))
      .then(({ status, value }) => {
        if (ModalStatus.Confirmed === status) {
          return updateProjection(value.trim().toLocaleUpperCase());
        }
      })
      .catch((err) => {
        toasts.genericError(err);
        logger.error('Prompt error: ', err);
      });
  }, [mainView.projection.name, modals, t, toasts, updateProjection]);

  const handleSetDefaultProjection = useCallback(() => {
    updateProjection(DEFAULT_PROJECTION.name).catch((err) => {
      toasts.genericError(err);
      logger.error('Reset projection error: ', err);
    });
  }, [toasts, updateProjection]);

  return (
    <div className={clsx(className, 'mr-3')}>
      <div className={'d-flex align-items-center'}>
        <span className={'badge bg-secondary mr-2'}>{t('Projection')}</span>
        <div className={'mr-2'}>{mainView.projection.name}</div>

        <button
          onClick={handleChangeProjection}
          title={t('Edit_project_name')}
          disabled={changesDisabled}
          className={'btn btn-link mr-3'}
          data-cy={'edit-projection'}
        >
          <FaIcon icon={IconDefs.faPencilAlt} className={'mr-1'} /> {t('Change')}
        </button>

        <a href={link} className={'mr-2'} target={'_blank'} rel="noreferrer">
          <FaIcon icon={IconDefs.faQuestionCircle} className={'mr-1'} /> {t('What_is_this')}
        </a>
      </div>

      {changesDisabled && <small className={clsx(`mb-3`)}>{t('To_change_projection_you_must_delete_geometries')}</small>}

      <div className={'d-flex align-items-center mb-2'}>
        {!changesDisabled && (
          <button onClick={handleSetDefaultProjection} disabled={changesDisabled} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faUndo} className={'mr-2'} />
            {t('Default_value')}
          </button>
        )}
      </div>
    </div>
  );
}
