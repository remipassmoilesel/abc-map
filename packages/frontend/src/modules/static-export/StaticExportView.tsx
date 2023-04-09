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

import Cls from './StaticExportView.module.scss';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AbcLayout, AbcNorth, AbcProjection, AbcTextFrame, LayoutFormat, LayoutFormats, Logger } from '@abc-map/shared';
import LayoutList from './layout-list/LayoutList';
import { HistoryKey } from '../../core/history/HistoryKey';
import { AddLayoutsChangeset } from '../../core/history/changesets/layouts/AddLayoutsChangeset';
import { RemoveLayoutsChangeset } from '../../core/history/changesets/layouts/RemoveLayoutsChangeset';
import { SetLayoutPositionChangeset } from '../../core/history/changesets/layouts/SetLayoutPositionChangeset';
import { LayoutRenderer } from '../../core/project/rendering/LayoutRenderer';
import { UpdateLayoutChangeset } from '../../core/history/changesets/layouts/UpdateLayoutChangeset';
import { FileIO } from '../../core/utils/FileIO';
import { pageSetup } from '../../core/utils/page-setup';
import LayoutControls from './export-controls/ExportControls';
import { ExportFormat } from './ExportFormat';
import uuid from 'uuid-random';
import SideMenu from '../../components/side-menu/SideMenu';
import { IconDefs } from '../../components/icon/IconDefs';
import { useServices } from '../../core/useServices';
import { useAppSelector } from '../../core/store/hooks';
import { useTranslation } from 'react-i18next';
import { ExportKeyboardListener } from './ExportKeyboardListener';
import { isDesktopDevice } from '../../core/ui/isDesktopDevice';
import { OperationStatus } from '../../core/ui/typings';
import { Views } from '../../core/geo/Views';
import { SetActiveLayoutChangeset } from '../../core/history/changesets/layouts/SetActiveLayoutChangeset';
import { AddLayoutTextFrameChangeset } from '../../core/history/changesets/layouts/AddLayoutTextFrameChangeset';
import { RemoveLayoutTextFrameChangeset } from '../../core/history/changesets/layouts/RemoveLayoutTextFrameChangeset';
import { UpdateTextFrameChangeset } from '../../core/history/changesets/UpdateTextFrameChangeset';
import debounce from 'lodash/debounce';
import { AddLayoutScaleChangeset } from '../../core/history/changesets/layouts/AddLayoutScaleChangeset';
import { AbcScale } from '@abc-map/shared';
import { RemoveLayoutScaleChangeset } from '../../core/history/changesets/layouts/RemoveLayoutScaleChangeset';
import { UpdateLayoutScaleChangeset } from '../../core/history/changesets/layouts/UpdateLayoutScaleChangeset';
import { useActiveLayout } from '../../core/project/useActiveLayout';
import { useOfflineStatus } from '../../core/pwa/OnlineStatusContext';
import { LargeOfflineIndicator } from '../../components/offline-indicator/LargeOfflineIndicator';
import { AddLayoutNorthChangeset } from '../../core/history/changesets/layouts/AddLayoutNorthChangeset';
import { RemoveLayoutNorthChangeset } from '../../core/history/changesets/layouts/RemoveLayoutNorthChangeset';
import { UpdateLayoutNorthChangeset } from '../../core/history/changesets/layouts/UpdateLayoutNorthChangeset';
import isEqual from 'lodash/isEqual';
import { LayoutPreview } from './layout-preview/LayoutPreview';

const logger = Logger.get('StaticExportView.tsx', 'warn');

export function StaticExportView() {
  const { t } = useTranslation('StaticExport');
  const { geo, history, toasts, modals, project } = useServices();
  const shortcuts = useRef<ExportKeyboardListener | null>(null);

  const layouts = useAppSelector((st) => st.project.layouts.list);
  const activeLayout = useActiveLayout();

  const offline = useOfflineStatus();

  // Setup page
  useEffect(() => pageSetup(t('Layout'), t('Create_layout_to_export_your_map')));

  // Keyboard shortcut setup
  useEffect(() => {
    shortcuts.current = ExportKeyboardListener.create();
    shortcuts.current.initialize();
    return () => {
      shortcuts.current?.destroy();
    };
  }, []);

  // User has selected a layout
  const handleSelected = useCallback(
    (lay: AbcLayout) => {
      const setActiveLayout = SetActiveLayoutChangeset.create(lay);
      setActiveLayout
        .apply()
        .then(() => history.register(HistoryKey.Export, setActiveLayout))
        .catch((err) => logger.error('Cannot set active layout: ', err));
    },
    [history]
  );

  // User creates a new layout
  const handleNewLayout = useCallback(() => {
    const name = `Page ${layouts.length + 1}`;
    const view = geo.getMainMap().unwrap().getView();
    const center = view.getCenter();
    const resolution = view.getResolution();
    const rotation = view.getRotation();
    if (!center || !resolution) {
      logger.error('Cannot create new layout: ', { center, resolution });
      return;
    }

    const apply = async () => {
      // If resolution is below one, we keep it. Otherwise we use a greater one.
      const layoutRes = resolution < 1 ? resolution : Math.round(resolution - resolution * 0.2);
      const projection: AbcProjection = { name: view.getProjection().getCode() };
      const layout: AbcLayout = {
        id: uuid(),
        name,
        format: LayoutFormats.A4_LANDSCAPE,
        view: Views.normalize({ center, resolution: layoutRes, projection, rotation }),
        textFrames: [],
      };

      const cs = AddLayoutsChangeset.create([layout]);
      await cs.apply();
      history.register(HistoryKey.Export, cs);
    };

    apply().catch((err) => logger.error('Cannot create layout: ', err));
  }, [geo, history, layouts.length]);

  // User change layout position in list
  const updateLayoutIndex = useCallback(
    (diff: number) => {
      if (!activeLayout) {
        toasts.info(t('You_muse_select_a_layout'));
        return;
      }

      const apply = async () => {
        const oldIndex = layouts.findIndex((lay) => lay.id === activeLayout.id);
        let newIndex = oldIndex + diff;
        if (newIndex < 0) {
          newIndex = 0;
        }
        if (newIndex > layouts.length - 1) {
          newIndex = layouts.length - 1;
        }

        if (newIndex !== oldIndex) {
          const cs = SetLayoutPositionChangeset.create(activeLayout, oldIndex, newIndex);
          await cs.apply();
          history.register(HistoryKey.Export, cs);
        }
      };

      apply().catch((err) => logger.error('Cannot change layout index', err));
    },
    [activeLayout, history, layouts, t, toasts]
  );

  const handleLayoutUp = useCallback(() => updateLayoutIndex(-1), [updateLayoutIndex]);
  const handleLayoutDown = useCallback(() => updateLayoutIndex(+1), [updateLayoutIndex]);

  // User delete all layouts
  const handleClearAll = useCallback(() => {
    const apply = async () => {
      const cs = RemoveLayoutsChangeset.create(layouts);
      await cs.apply();
      history.register(HistoryKey.Export, cs);
    };

    apply().catch((err) => logger.error('Cannot delete layouts: ', err));
  }, [history, layouts]);

  // User delete layout
  const handleDeleted = useCallback(
    (lay: AbcLayout) => {
      const apply = async () => {
        const cs = RemoveLayoutsChangeset.create([lay]);
        await cs.apply();
        history.register(HistoryKey.Export, cs);
      };

      apply().catch((err) => logger.error('Cannot delete layout: ', err));
    },
    [history]
  );

  // User change layout format
  const handleFormatChanged = useCallback(
    (format: LayoutFormat) => {
      const formatChanged = activeLayout?.format.id !== format.id;
      if (!activeLayout || !formatChanged) {
        return;
      }

      const update: AbcLayout = {
        ...activeLayout,
        format,
      };

      const apply = async () => {
        const cs = UpdateLayoutChangeset.create(activeLayout, update);
        await cs.apply();
        history.register(HistoryKey.Export, cs);
      };

      apply().catch((err) => logger.error('Cannot update layout: ', err));
    },
    [activeLayout, history]
  );

  // User change layout view (scroll or drag)
  const handleLayoutChanged = useCallback(
    (layout: AbcLayout) => {
      const before = layouts.find((lay) => lay.id === layout.id);
      if (!before) {
        logger.error('Cannot register changeset', { before, layout });
        return;
      }

      const apply = async () => {
        const cs = UpdateLayoutChangeset.create(before, layout);
        await cs.apply();
        history.register(HistoryKey.Export, cs);
      };

      apply().catch((err) => logger.error('Cannot update layout: ', err));
    },
    [history, layouts]
  );

  // User exports layouts to PDF or PNG
  const handleExport = useCallback(
    (format: ExportFormat) => {
      const renderer = new LayoutRenderer();
      renderer.init();

      if (!layouts.length) {
        toasts.info(t('You_must_create_layouts_first'));
        return;
      }

      const exportLayouts = async () => {
        let result: Blob | undefined;
        let status: OperationStatus = OperationStatus.Succeed;
        switch (format) {
          case ExportFormat.PDF:
            result = await renderer.renderLayoutsAsPdf(layouts, geo.getMainMap());
            FileIO.downloadBlob(result, 'map.pdf');
            break;

          case ExportFormat.PNG:
            result = await renderer.renderLayoutsAsPng(layouts, geo.getMainMap());
            FileIO.downloadBlob(result, 'map.zip');
            break;

          default:
            logger.error('Unhandled format: ', format);
            toasts.genericError();
            status = OperationStatus.Interrupted;
        }

        return status;
      };

      // We MUST block UI here as export map will be mounted on current view
      modals
        .longOperationModal(exportLayouts)
        .then(() => modals.solicitation())
        .catch((err) => {
          toasts.genericError();
          logger.error(err);
        })
        .finally(() => renderer.dispose());
    },
    [geo, layouts, modals, t, toasts]
  );

  const handleAddTextFrame = useCallback(
    (frame: AbcTextFrame) => {
      if (!activeLayout) {
        return;
      }

      const addFrame = AddLayoutTextFrameChangeset.create(activeLayout, frame);
      addFrame
        .apply()
        .then(() => history.register(HistoryKey.Export, addFrame))
        .catch((err) => logger.error('Cannot add text frame: ', err));
    },
    [activeLayout, history]
  );

  const handleDeleteTextFrame = useCallback(
    (frame: AbcTextFrame) => {
      if (!activeLayout) {
        return;
      }

      const removeFrame = RemoveLayoutTextFrameChangeset.create(activeLayout, frame);
      removeFrame
        .apply()
        .then(() => history.register(HistoryKey.Export, removeFrame))
        .catch((err) => logger.error('Cannot remove text frame: ', err));
    },
    [activeLayout, history]
  );

  const handleTextFrameChangeDebounced = useMemo(
    () =>
      debounce((before: AbcTextFrame, after: AbcTextFrame) => {
        // Text frame may have been deleted
        if (!project.getTextFrames().find((lay) => after.id === lay.id)) {
          logger.warn('Export view have been deleted, cannot add history task');
          return;
        }

        const changeset = UpdateTextFrameChangeset.create(before, after);
        changeset
          .apply()
          .then(() => history.register(HistoryKey.Export, changeset))
          .catch((err) => logger.error('Cannot update text frame: ', err));
      }, 150),
    [history, project]
  );

  const handleTextFrameChange = useCallback(
    (before: AbcTextFrame, after: AbcTextFrame) => {
      if (!activeLayout) {
        return;
      }

      // We update text frame, but we limit creation of history changesets
      project.updateTextFrame(after);
      handleTextFrameChangeDebounced(before, after);
    },
    [activeLayout, handleTextFrameChangeDebounced, project]
  );

  const handleAddScale = useCallback(
    (scale: AbcScale) => {
      if (!activeLayout) {
        return;
      }

      const changeset = AddLayoutScaleChangeset.create(activeLayout, scale);
      changeset
        .apply()
        .then(() => history.register(HistoryKey.Export, changeset))
        .catch((err) => logger.error('Cannot add scale: ', err));
    },
    [activeLayout, history]
  );

  const handleRemoveScale = useCallback(() => {
    if (!activeLayout || !activeLayout.scale) {
      return;
    }

    const changeset = RemoveLayoutScaleChangeset.create(activeLayout, activeLayout.scale);
    changeset
      .apply()
      .then(() => history.register(HistoryKey.Export, changeset))
      .catch((err) => logger.error('Cannot remove scale: ', err));
  }, [activeLayout, history]);

  const handleAddNorth = useCallback(
    (north: AbcNorth) => {
      if (!activeLayout) {
        return;
      }

      const changeset = AddLayoutNorthChangeset.create(activeLayout, north);
      changeset
        .apply()
        .then(() => history.register(HistoryKey.Export, changeset))
        .catch((err) => logger.error('Cannot add scale: ', err));
    },
    [activeLayout, history]
  );

  const handleRemoveNorth = useCallback(() => {
    if (!activeLayout || !activeLayout.north) {
      return;
    }

    const changeset = RemoveLayoutNorthChangeset.create(activeLayout, activeLayout.north);
    changeset
      .apply()
      .then(() => history.register(HistoryKey.Export, changeset))
      .catch((err) => logger.error('Cannot remove scale: ', err));
  }, [activeLayout, history]);

  const handleScaleChanged = useCallback(
    (scale: AbcScale) => {
      if (!activeLayout || !activeLayout.scale) {
        return;
      }

      if (isEqual(activeLayout.scale, scale)) {
        return;
      }

      const changeset = UpdateLayoutScaleChangeset.create(activeLayout, activeLayout.scale, scale);
      changeset
        .apply()
        .then(() => history.register(HistoryKey.Export, changeset))
        .catch((err) => logger.error('Cannot update scale: ', err));
    },
    [activeLayout, history]
  );

  const handleNorthChange = useCallback(
    (north: AbcNorth) => {
      if (!activeLayout || !activeLayout.north) {
        return;
      }

      if (isEqual(activeLayout.north, north)) {
        return;
      }

      const changeset = UpdateLayoutNorthChangeset.create(activeLayout, activeLayout.north, north);
      changeset
        .apply()
        .then(() => history.register(HistoryKey.Export, changeset))
        .catch((err) => logger.error('Cannot update scale: ', err));
    },
    [activeLayout, history]
  );

  if (offline) {
    return (
      <LargeOfflineIndicator>
        <span dangerouslySetInnerHTML={{ __html: t('Connect_to_the_Internet_to_export_your_map') }} />
      </LargeOfflineIndicator>
    );
  }

  return (
    <>
      <div className={Cls.exportView}>
        {/* Layout list on left */}
        <SideMenu
          title={t('Layouts_menu')}
          buttonIcon={IconDefs.faCopy}
          buttonStyle={{ top: '50vh', left: '2vw' }}
          menuPlacement={'left'}
          menuId={'views/ExportView-layouts-list'}
          initiallyOpened={isDesktopDevice()}
          data-cy={'layouts-menu'}
        >
          <LayoutList layouts={layouts} active={activeLayout} onSelected={handleSelected} onNewLayout={handleNewLayout} onDeleted={handleDeleted} />
        </SideMenu>

        {/* Layout preview on center */}
        <LayoutPreview
          layout={activeLayout}
          mainMap={geo.getMainMap()}
          onLayoutChanged={handleLayoutChanged}
          onNewLayout={handleNewLayout}
          onTextFrameChange={handleTextFrameChange}
          onDeleteTextFrame={handleDeleteTextFrame}
          onScaleChange={handleScaleChanged}
          onNorthChange={handleNorthChange}
        />

        {/* Controls on right */}
        <SideMenu
          title={t('Controls_menu')}
          buttonIcon={IconDefs.faRuler}
          buttonStyle={{ top: '50vh', right: '2vw' }}
          menuPlacement={'right'}
          menuId={'views/ExportView-controls'}
          initiallyOpened={isDesktopDevice()}
          data-cy={'controls-menu'}
        >
          <LayoutControls
            onFormatChanged={handleFormatChanged}
            onNewLayout={handleNewLayout}
            onLayoutUp={handleLayoutUp}
            onLayoutDown={handleLayoutDown}
            onClearAll={handleClearAll}
            onAddTextFrame={handleAddTextFrame}
            onExport={handleExport}
            onAddScale={handleAddScale}
            onRemoveScale={handleRemoveScale}
            onAddNorth={handleAddNorth}
            onRemoveNorth={handleRemoveNorth}
          />
        </SideMenu>
      </div>
    </>
  );
}
