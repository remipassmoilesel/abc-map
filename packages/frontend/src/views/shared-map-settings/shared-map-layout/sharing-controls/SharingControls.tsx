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

import HistoryControls from '../../../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import React, { useCallback, useState } from 'react';
import { useServices } from '../../../../core/useServices';
import { AbcScale, AbcSharedView, AbcTextFrame, Logger } from '@abc-map/shared';
import SharingCodesModal from '../sharing-codes-modal/SharingCodesModal';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useAppSelector } from '../../../../core/store/hooks';
import LayerVisibilitySelector from './layer-selector/LayerVisibilitySelector';
import { UpdateSharedViewsChangeset } from '../../../../core/history/changesets/shared-views/UpdateSharedViewChangeset';
import isEqual from 'lodash/isEqual';
import { withTranslation } from 'react-i18next';
import { useSaveProjectOnline } from '../../../../core/project/useSaveProjectOnline';
import { ProjectStatus } from '../../../../core/project/ProjectStatus';
import { MapDimensions } from './map-dimensions/MapDimensions';
import { TextFrameControls } from '../../../../components/text-frame-controls/TextFrameControls';
import { ScaleControls } from '../../../../components/scale-controls/ScaleControls';

const logger = Logger.get('SharingControls.tsx');

const t = prefixedTranslation('SharedMapSettingsView:');

interface Props {
  onNewView: () => void;
  onAddTextFrame: (frame: AbcTextFrame) => void;
  onAddScale: (scale: AbcScale) => void;
  onRemoveScale: () => void;
}

function SharingControls(props: Props) {
  const saveProject = useSaveProjectOnline();
  const { project, history } = useServices();

  const { onNewView: handleNewView, onAddTextFrame: handleAddTextFrame, onAddScale, onRemoveScale: handleRemoveScale } = props;
  const [codesModal, showCodesModal] = useState(false);
  const views = useAppSelector((st) => st.project.sharedViews.list);
  const { width, height } = useAppSelector((st) => st.project.sharedViews.mapDimensions);
  const activeViewId = useAppSelector((st) => st.project.sharedViews.activeId);
  const activeView = views.find((v) => v.id === activeViewId);
  const fullscreen = useAppSelector((st) => st.project.sharedViews.fullscreen);

  const handlePublish = useCallback(() => {
    saveProject().catch((err) => logger.error('Cannot save project: ', err));
  }, [saveProject]);

  const handleShowPreview = useCallback(() => {
    saveProject()
      .then((status) => {
        if (ProjectStatus.Ok === status) {
          const url = project.getPublicLink();
          window.open(url, 'abc-map_preview')?.focus();
        }
      })
      .catch((err) => logger.error('Preview error: ', err));
  }, [project, saveProject]);

  const handleToggleSharingCodes = useCallback(() => showCodesModal(!codesModal), [codesModal]);

  const handleDisableSharing = useCallback(() => {
    project.setPublic(false);
    saveProject().catch((err) => {
      logger.error('Cannot publish project: ', err);
      project.setPublic(true);
    });
  }, [project, saveProject]);

  const handleUpdate = useCallback(
    (view: AbcSharedView) => {
      if (!activeView || isEqual(activeView, view)) {
        return;
      }

      const cs = UpdateSharedViewsChangeset.create([{ before: activeView, after: view }]);
      cs.apply()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot update view: ', err));
    },
    [activeView, history]
  );

  const handleDimensionsChanged = useCallback((width: number, height: number) => project.setSharedMapDimensions(width, height), [project]);

  const handleToggleFullscreen = useCallback(() => project.toggleSharedMapFullScreen(), [project]);

  const handleAddScale = useCallback((scale: AbcScale) => onAddScale({ ...scale, x: 45, y: 5 }), [onAddScale]);

  return (
    <>
      <HistoryControls historyKey={HistoryKey.SharedViews} />

      <div className={'control-block'}>
        <div className={'alert alert-info'}>{t('Remember_to_publish_your_changes')} 😉</div>

        <div className={'control-item'}>
          <button onClick={handleShowPreview} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faEye} className={'mr-2'} />
            {t('Overview')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handlePublish} className={'btn btn-link'} data-cy={'publish'}>
            <FaIcon icon={IconDefs.faUpload} className={'mr-2'} />
            {t('Publish')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleToggleSharingCodes} className={'btn btn-link'} data-cy={'sharing-codes'}>
            <FaIcon icon={IconDefs.faLink} className={'mr-2'} />
            {t('Address_and_sharing_codes')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleDisableSharing} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faBan} className={'mr-2'} />
            {t('Disable_sharing')}
          </button>
        </div>
      </div>

      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={handleNewView} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faPlus} className={'mr-2'} />
            {t('New_view')}
          </button>
        </div>
      </div>

      {/* Text frames and scale */}
      <TextFrameControls disabled={!activeView} onAddTextFrame={handleAddTextFrame} />
      <ScaleControls disabled={!activeView} hasScale={!!activeView?.scale} onAddScale={handleAddScale} onRemoveScale={handleRemoveScale} />

      {/* Layer selection */}
      {activeView && (
        <div className={'control-block'}>
          <div className={'control-item'}>{t('Visible_layers')}</div>
          <LayerVisibilitySelector view={activeView} onUpdate={handleUpdate} />
        </div>
      )}

      {/* Map dimensions */}
      <MapDimensions width={width} height={height} fullscreen={fullscreen} onChange={handleDimensionsChanged} onToggleFullscreen={handleToggleFullscreen} />

      {/* Sharing codes */}
      {codesModal && <SharingCodesModal onClose={handleToggleSharingCodes} />}
    </>
  );
}

export default withTranslation()(SharingControls);
