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

import Cls from './I18nInput.module.scss';
import { I18nText, Language } from '@abc-map/shared';
import { ChangeEvent, useCallback } from 'react';
import clsx from 'clsx';

interface Props {
  value: I18nText[];
  onChange: (v: I18nText[]) => void;
  className?: string;
}

export function I18nInput(props: Props) {
  const { value, onChange, className } = props;

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>, language: Language) => {
      const updated = value.map(({ language: lang, text }) => {
        if (language === lang) {
          return { language, text: ev.target.value };
        } else {
          return { language: lang, text };
        }
      });
      onChange(updated);
    },
    [onChange, value]
  );

  return (
    <div className={clsx(className)}>
      {value.map(({ language, text }) => (
        <div key={language} className={'d-flex mb-2'}>
          <div className={Cls.lang}>{language.toLocaleUpperCase()}:</div>
          <input type={'text'} value={text} onChange={(ev) => handleChange(ev, language)} className={'form-control'} />
        </div>
      ))}
    </div>
  );
}
