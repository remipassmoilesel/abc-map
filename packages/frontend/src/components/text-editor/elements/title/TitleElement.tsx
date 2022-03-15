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

import Cls from './TitleElement.module.scss';
import { RenderElementProps } from 'slate-react';
import { TitleElement as TitleElementDef } from '../../typings';

type Props = RenderElementProps & { element: TitleElementDef };

export function TitleElement(props: Props) {
  const { level } = props.element;

  switch (level) {
    case 1:
      return (
        <h1 {...props.attributes} className={Cls.title}>
          {props.children}
        </h1>
      );
    case 2:
      return (
        <h2 {...props.attributes} className={Cls.title}>
          {props.children}
        </h2>
      );
    case 3:
      return (
        <h3 {...props.attributes} className={Cls.title}>
          {props.children}
        </h3>
      );
    case 4:
      return (
        <h4 {...props.attributes} className={Cls.title}>
          {props.children}
        </h4>
      );
    default:
      return (
        <h5 {...props.attributes} className={Cls.title}>
          {props.children}
        </h5>
      );
  }
}
