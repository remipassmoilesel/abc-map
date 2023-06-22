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

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { getAbcWindow, Logger } from '@abc-map/shared';
import { References } from '@abc-map/user-documentation';
import debounce from 'lodash/debounce';
import { UiActions } from '../../core/store/ui/actions';
import { pageSetup } from '../../core/utils/page-setup';
import { getDocumentationLang, prefixedTranslation } from '../../i18n/i18n';
import Cls from './DocumentationView.module.scss';
import { IconDefs } from '../../components/icon/IconDefs';
import SideMenu from '../../components/side-menu/SideMenu';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { withTranslation } from 'react-i18next';
import { FloatingButton } from '../../components/floating-button/FloatingButton';
import { isDesktopDevice } from '../../core/ui/isDesktopDevice';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../routes';

const logger = Logger.get('DocumentationView.tsx');

const t = prefixedTranslation('DocumentationView:');

function DocumentationView() {
  const position = useAppSelector((st) => st.ui.documentation.scrollPosition);
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const reference = References.find((ref) => ref.lang === getDocumentationLang());
  const navigate = useNavigate();

  // Page setup
  useEffect(() => {
    pageSetup('Documentation', `La documentation explique le fonctionnement d'Abc-Map 📖`);
  }, []);

  // When user scroll documentation, we save scrollTop value in order to restore it
  const handleScroll = useMemo(
    () =>
      debounce(() => {
        const scroll = scrollRef.current;
        if (!scroll) {
          logger.error('Ref not ready');
          return;
        }

        dispatch(UiActions.setDocumentationScrollPosition(scroll.scrollTop));
      }, 100),
    [dispatch]
  );

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) {
      logger.error('Ref not ready');
      return;
    }
    scroll.addEventListener('scroll', handleScroll);
    scroll.scrollTop = position;

    return () => scroll.removeEventListener('scroll', handleScroll);
  }, [handleScroll, position]);

  const handleGoToTop = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) {
      logger.error('Ref not ready');
      return;
    }

    scroll.scroll({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // This function is used in documentation
    getAbcWindow().abc.goToFunding = () => navigate(Routes.funding().format());
  }, [navigate]);

  return (
    <div className={Cls.documentation} ref={scrollRef}>
      {reference && (
        <>
          {/* Table of content button */}
          <SideMenu
            buttonIcon={IconDefs.faListOl}
            buttonStyle={{ top: '45vh', right: '6vmin' }}
            title={t('Table_of_content')}
            menuPlacement={'right'}
            menuId={'views/DocumentationView-toc'}
            closeOnClick={true}
            initiallyOpened={isDesktopDevice()}
          >
            <div className={Cls.toc} dangerouslySetInnerHTML={{ __html: reference?.toc }} />
          </SideMenu>

          {/* Go to top button */}
          <FloatingButton icon={IconDefs.faArrowUp} style={{ top: '55vh', right: '6vmin' }} title={t('Back_to_top')} onClick={handleGoToTop} />

          {/* Documentation viewport */}
          <div className={Cls.viewport}>
            {reference?.modules.map((mod, i) => (
              <div key={i} className={Cls.module} dangerouslySetInnerHTML={{ __html: mod }} />
            ))}
          </div>
        </>
      )}

      {/* No documentation found. This should normally never happen as there is a fallback language */}
      {!reference && <h3 className={'my-5'}>Sorry, documentation is not available in your language</h3>}
    </div>
  );
}

export default withTranslation()(DocumentationView);
