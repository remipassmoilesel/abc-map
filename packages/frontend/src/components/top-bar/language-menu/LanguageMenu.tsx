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

import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { LabeledLanguages } from '../../../i18n/Languages';
import { getLang, setLang } from '../../../i18n/i18n';
import { Logger } from '@abc-map/shared';
import Cls from './LanguageMenu.module.scss';
import { FaIcon } from '../../icon/FaIcon';
import { IconDefs } from '../../icon/IconDefs';

const logger = Logger.get('LanguageMenu.tsx');

export function LanguageMenu() {
  return (
    <Dropdown className={Cls.menu} align={'end'}>
      {/* Menu icon */}
      <Dropdown.Toggle variant="light">
        <FaIcon icon={IconDefs.faLanguage} title={'Change language'} className={Cls.toggleIcon} />
      </Dropdown.Toggle>

      {/* Menu items */}
      <Dropdown.Menu className={Cls.dropdown}>
        {LabeledLanguages.All.map((lang) => {
          const active = getLang() === lang.value;
          const handleClick = () => setLang(lang.value).catch((err) => logger.error('Cannot set lang: ', err));
          return (
            <Dropdown.Item key={lang.value} onClick={handleClick} className={`d-flex align-items-center ${active ? Cls.active : ''}`}>
              <img src={lang.icon} alt={lang.label} className={'mr-2'} /> {lang.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
