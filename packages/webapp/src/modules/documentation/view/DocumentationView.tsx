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

import React, { CSSProperties, useCallback, useEffect, useMemo, useRef } from 'react';
import { getAbcWindow, Logger } from '@abc-map/shared';
import Cls from './DocumentationView.module.scss';
import { useTranslation, withTranslation } from 'react-i18next';
import { useServices } from '../../../core/useServices';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes } from '../../../routes';
import clsx from 'clsx';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { getLang } from '../../../i18n/i18n';
import { BundledModuleId } from '@abc-map/shared';
import { Env } from '../../../core/utils/Env';
import { isExternalURL, rewriteAssetsUrls, rewriteContentPath } from './helpers';
import { usePersistentStore } from '../state';
import { WindowNames } from '../../../core/ui/WindowNames';

const logger = Logger.get('DocumentationView.tsx');

function DocumentationView() {
  const { t } = useTranslation('DocumentationModule');
  const { documentation } = useServices();
  const location = useLocation();
  const navigate = useNavigate();

  // Page setup
  useEffect(() => {
    // This function is used in documentation
    getAbcWindow().abc.goToFunding = () => navigate(Routes.funding().format());
  }, [navigate]);

  // We MUST ensure that module is initially loaded with a terminal '/', otherwise relative links may be broken
  useEffect(() => {
    const docRoute = Routes.module().withParams({ moduleId: BundledModuleId.Documentation });
    if (location.pathname.endsWith(docRoute)) {
      navigate(docRoute + '/', { replace: true });
    }
  }, [location.pathname, navigate]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      logger.error('Not ready');
      return;
    }

    function interceptClick(ev: MouseEvent) {
      const target = (ev.target || ev.srcElement) as HTMLElement | null;
      const href = target?.getAttribute('href');

      // Anchor links, next titles
      // We prevent default behavior of anchor links in order to not refresh the page
      if (target instanceof HTMLElement && target.dataset['kind'] === 'anchor-link') {
        ev.preventDefault();
        return;
      }

      // External links are opened in a new window
      if (href && isExternalURL(href)) {
        ev.preventDefault();
        window.open(href, WindowNames.Blank);
        return;
      }

      // We use a hack to scroll to anchors
      if (href && href.startsWith('#')) {
        const element = container?.querySelector(href);

        ev.preventDefault();
        navigate(href);
        element?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Static documentation links are open in a new tab
      if (href?.startsWith('/documentation/')) {
        ev.preventDefault();
        window.open(href, WindowNames.Documentation);
      }
      // In app links are processed by react router
      else if (href) {
        ev.preventDefault();
        navigate(href);
      }
    }

    container.addEventListener('click', interceptClick);
    return () => container.removeEventListener('click', interceptClick);
  }, [location.hash, location.pathname, navigate]);

  // Each time path change we load appropriate page
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      logger.error('Not ready');
      return;
    }

    const load = async () => {
      const contentPath = rewriteContentPath(location.pathname);
      logger.info('Fetching content: ', contentPath);

      // We load content
      const content = await documentation.getContent(contentPath);

      // We update UI
      rewriteAssetsUrls(content, contentPath);
      container.innerHTML = '';
      container.appendChild(content);

      // We remove elements that must be hidden
      container.querySelectorAll('.hidden-in-webapp').forEach((element) => {
        element.remove();
      });

      // We scroll to anchor if any
      const hash = window.location.hash;
      try {
        if (hash) {
          const target = container.querySelector(hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          } else {
            logger.error('Cannot scroll to target, not found: ' + hash);
          }
        }
      } catch (err) {
        logger.error('Cannot scroll to target: ' + hash, err);
      }
    };

    load().catch((err) => {
      logger.error('Cannot get content: ', err);
      container.innerHTML = `<div class=${Cls.pageNotLoaded}>${t('This_page_is_not_loading')} 💥 </div>`;
    });
  }, [documentation, location.pathname, navigate, t]);

  const handleOpenInNewTab = useCallback(() => {
    // Example: http://localhost:3005/fr/modules/documentation/01_presentation/#Hello?test=false"
    const route = document.location.href
      // We remove webapp lang scheme
      .replace('/' + getLang() + '/modules', '')
      // We add documentation lang scheme
      .replace('/documentation/', '/documentation/' + getLang() + '/');

    if (!Env.isE2e()) {
      window.open(route, WindowNames.Documentation);
    }
    // In E2E we cannot handle another tab
    else {
      window.location.assign(route);
    }
  }, []);

  const handleGoToToc = useCallback(() => {
    navigate(Routes.module().withParams({ moduleId: BundledModuleId.Documentation }));
  }, [navigate]);

  const { zoom, setZoom } = usePersistentStore();
  const handleZoom = useCallback(() => {
    const maxZoom = 1.5;
    const increment = 0.15;

    let newValue = zoom + increment;
    if (newValue > maxZoom) {
      newValue = 1;
    }

    setZoom(newValue);
  }, [setZoom, zoom]);

  const contentStyle: CSSProperties = useMemo(
    () => ({
      transformOrigin: '0% 0%',
      transform: 'scale(' + zoom + ')',
    }),
    [zoom]
  );

  return (
    <div className={Cls.documentation}>
      {/* We wrap the content to maintain the layout when the user zooms in */}
      <div className={Cls.contentWrapper}>
        {/* Documentation content is inserted here */}
        <div ref={containerRef} style={contentStyle} data-cy={'documentation-content'} className={Cls.content}></div>
      </div>

      {/* "Go to TOC" and "Open in new tab" buttons */}
      <div className={Cls.topButtons}>
        <button onClick={handleGoToToc} className={clsx('d-flex align-items-center btn btn-outline-primary me-2')} data-cy="go-to-table-of-content">
          <FaIcon icon={IconDefs.faList} className={'me-2'} />
          {t('Table_of_content')}
        </button>

        <button onClick={handleZoom} className={clsx('d-flex align-items-center btn btn-outline-primary me-2')}>
          <FaIcon icon={IconDefs.faMagnifyingGlass} className={'me-2'} />
          {t('Zoom')}
        </button>

        <button
          onClick={handleOpenInNewTab}
          className={clsx(Cls.openInNewTab, 'd-flex align-items-center btn btn-outline-secondary me-2')}
          data-cy="open-in-new-tab"
        >
          <FaIcon icon={IconDefs.faArrowCircleRight} className={'me-2'} />
          {t('Open_in_a_new_tab')}
        </button>
      </div>

      <div data-cy={'in-app-documentation'}></div>
    </div>
  );
}

export default withTranslation()(DocumentationView);
