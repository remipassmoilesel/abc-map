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

import { useCallback, useMemo } from 'react';
import { AbcNorth, AbcScale, AbcTextFrame, AbcView, LayerState, Logger } from '@abc-map/shared';
import SideMenu from '../../../../components/side-menu/SideMenu';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useAppSelector } from '../../../../core/store/hooks';
import { useServices } from '../../../../core/useServices';
import SharingControls from './sharing-controls/SharingControls';
import { nanoid } from 'nanoid';
import { UpdateSharedViewsChangeset } from '../../../../core/history/changesets/shared-views/UpdateSharedViewChangeset';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import isEqual from 'lodash/isEqual';
import { useTranslation, withTranslation } from 'react-i18next';
import { AddSharedViewChangeset } from '../../../../core/history/changesets/shared-views/AddSharedViewChangeset';
import { useActiveSharedView } from '../../../../core/project/useActiveSharedView';
import { Views } from '../../../../core/geo/Views';
import { AddSharedViewTextFrameChangeset } from '../../../../core/history/changesets/shared-views/AddSharedViewTextFrameChangeset';
import { RemoveSharedViewTextFrameChangeset } from '../../../../core/history/changesets/shared-views/RemoveSharedViewTextFrameChangeset';
import { AddSharedViewScaleChangeset } from '../../../../core/history/changesets/shared-views/AddSharedViewScaleChangeset';
import debounce from 'lodash/debounce';
import { UpdateTextFrameChangeset } from '../../../../core/history/changesets/UpdateTextFrameChangeset';
import { UpdateSharedViewScaleChangeset } from '../../../../core/history/changesets/shared-views/UpdateSharedViewScaleChangeset';
import { PreviewMap } from './preview-map/PreviewMap';
import { RemoveSharedViewScaleChangeset } from '../../../../core/history/changesets/shared-views/RemoveSharedViewScaleChangeset';
import { UpdateSharedViewNorthChangeset } from '../../../../core/history/changesets/shared-views/UpdateSharedViewNorthChangeset';
import { AddSharedViewNorthChangeset } from '../../../../core/history/changesets/shared-views/AddSharedViewNorthChangeset';
import { RemoveSharedViewNorthChangeset } from '../../../../core/history/changesets/shared-views/RemoveSharedViewNorthChangeset';

const logger = Logger.get('SharedMapLayout');

function SharedMapLayout() {
  const { project, geo, history } = useServices();
  const { t } = useTranslation('SharedMapSettingsModule');
  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const activeView = useActiveSharedView();

  // Update view when user change map position
  const handleViewMove = useCallback(
    (view: AbcView) => {
      if (!activeView) {
        return;
      }

      if (!isEqual(activeView.view, view)) {
        const cs = UpdateSharedViewsChangeset.create([{ before: activeView, after: { ...activeView, view } }]);
        cs.execute()
          .then(() => history.register(HistoryKey.SharedViews, cs))
          .catch((err) => logger.error('Cannot update shared view: ', err));
      }
    },
    [activeView, history]
  );

  const handleNewView = useCallback(() => {
    // Create new view from main map
    const map = geo.getMainMap();
    const id = nanoid();
    const title = `${t('View')} ${sharedViews.length + 1}`;
    const layers = map
      .getLayers()
      .map((l) => ({ layerId: l.getId(), visible: true }))
      .filter((st): st is LayerState => !!st.layerId);

    const mapView = Views.normalize(map.getView());

    // Create change set, apply and register it
    const cs = AddSharedViewChangeset.create([{ id, title, view: mapView, layers, textFrames: [] }]);
    cs.execute()
      .then(() => history.register(HistoryKey.SharedViews, cs))
      .catch((err) => logger.error('Cannot add view:', err));
  }, [geo, history, sharedViews.length, t]);

  const handleAddTextFrame = useCallback(
    (frame: AbcTextFrame) => {
      if (!activeView) {
        return;
      }

      const cs = AddSharedViewTextFrameChangeset.create(activeView, {
        ...frame,
        position: { x: 5, y: 5 },
        size: { width: 30, height: 30 },
      });
      cs.execute()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot add text frame:', err));
    },
    [activeView, history]
  );

  const handleRemoveTextFrame = useCallback(
    (frame: AbcTextFrame) => {
      if (!activeView) {
        return;
      }

      const cs = RemoveSharedViewTextFrameChangeset.create(activeView, frame);
      cs.execute()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot remove text frame:', err));
    },
    [activeView, history]
  );

  const handleTextFrameChangeDebounced = useMemo(
    () =>
      debounce((before: AbcTextFrame, after: AbcTextFrame) => {
        // Text frame may have been deleted
        if (!project.getTextFrames().find((lay) => after.id === lay.id)) {
          logger.warn('Shared view have been deleted, cannot add history task');
          return;
        }

        const cs = UpdateTextFrameChangeset.create(before, after);
        cs.execute()
          .then(() => history.register(HistoryKey.SharedViews, cs))
          .catch((err) => logger.error('Cannot update text frame: ', err));
      }, 150),
    [history, project]
  );

  const handleTextFrameChange = useCallback(
    (before: AbcTextFrame, after: AbcTextFrame) => {
      if (!activeView) {
        return;
      }

      // We update text frame, but we limit creation of history changesets
      project.updateTextFrame(after);
      handleTextFrameChangeDebounced(before, after);
    },
    [activeView, handleTextFrameChangeDebounced, project]
  );

  const handleAddScale = useCallback(
    (scale: AbcScale) => {
      if (!activeView) {
        return;
      }

      const cs = AddSharedViewScaleChangeset.create(activeView, scale);
      cs.execute()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot add scale:', err));
    },
    [activeView, history]
  );

  const handleRemoveScale = useCallback(() => {
    if (!activeView || !activeView.scale) {
      return;
    }

    const cs = RemoveSharedViewScaleChangeset.create(activeView, activeView.scale);
    cs.execute()
      .then(() => history.register(HistoryKey.SharedViews, cs))
      .catch((err) => logger.error('Cannot remove scale:', err));
  }, [activeView, history]);

  const handleScaleChanged = useCallback(
    (scale: AbcScale) => {
      if (!activeView?.scale) {
        return;
      }

      const cs = UpdateSharedViewScaleChangeset.create(activeView, activeView.scale, scale);
      cs.execute()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot update scale: ', err));
    },
    [activeView, history]
  );

  const handleNorthChanged = useCallback(
    (north: AbcNorth) => {
      if (!activeView?.north) {
        return;
      }

      const cs = UpdateSharedViewNorthChangeset.create(activeView, activeView.north, north);
      cs.execute()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot update scale: ', err));
    },
    [activeView, history]
  );

  const handleAddNorth = useCallback(
    (scale: AbcNorth) => {
      if (!activeView) {
        return;
      }

      const cs = AddSharedViewNorthChangeset.create(activeView, scale);
      cs.execute()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot add north:', err));
    },
    [activeView, history]
  );

  const handleRemoveNorth = useCallback(() => {
    if (!activeView || !activeView.north) {
      return;
    }

    const cs = RemoveSharedViewNorthChangeset.create(activeView, activeView.north);
    cs.execute()
      .then(() => history.register(HistoryKey.SharedViews, cs))
      .catch((err) => logger.error('Cannot remove scale:', err));
  }, [activeView, history]);

  return (
    <>
      {/* Shared view controls */}
      <SideMenu
        menuId={'views/SharedMapLayout-controls'}
        menuPlacement={'left'}
        buttonIcon={IconDefs.faCogs}
        buttonStyle={{ top: '50vh', left: '2rem' }}
        title={t('Configuration')}
        initiallyOpened={true}
      >
        <SharingControls
          onNewView={handleNewView}
          onAddTextFrame={handleAddTextFrame}
          onAddScale={handleAddScale}
          onRemoveScale={handleRemoveScale}
          onAddNorth={handleAddNorth}
          onRemoveNorth={handleRemoveNorth}
        />
      </SideMenu>

      {/* Preview map */}
      <PreviewMap
        onNewView={handleNewView}
        onViewMove={handleViewMove}
        onTextFrameChange={handleTextFrameChange}
        onRemoveTextFrame={handleRemoveTextFrame}
        onScaleChange={handleScaleChanged}
        onNorthChange={handleNorthChanged}
      />
    </>
  );
}

export default withTranslation()(SharedMapLayout);
