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

import clsx from 'clsx';
import Cls from './LanguageSection.module.scss';
import { LabeledLanguages } from '../../../i18n/Languages';
import { getLang, setLang } from '../../../i18n/i18n';
import React from 'react';
import { Logger } from '@abc-map/shared';
import { useNavigate } from 'react-router-dom';

const logger = Logger.get('LanguageSection.tsx');

interface Props {
  className?: string;
}

export function LanguageSection(props: Props) {
  const { className } = props;
  const navigate = useNavigate();

  return (
    <>
      <div className={className}>Not your language ?</div>
      <div className={clsx('mt-2 d-flex align-items-center', Cls.menu)}>
        {LabeledLanguages.All.map((lang) => {
          const active = getLang() === lang.value;
          const handleClick = () => {
            const previousLang = getLang();
            setLang(lang.value)
              .then(() => {
                const route = [
                  window.location.pathname.replace('/' + previousLang + '/', '/' + lang.value + '/'),
                  window.location.search,
                  window.location.hash,
                ].join('');
                navigate(route);
              })
              .catch((err) => logger.error('Cannot set lang: ', err));
          };
          return (
            <button key={lang.value} onClick={handleClick} className={clsx(`btn btn-link d-flex align-items-center`, active && Cls.active)}>
              <img src={lang.icon} alt={lang.label} className={'mr-2'} /> {lang.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
