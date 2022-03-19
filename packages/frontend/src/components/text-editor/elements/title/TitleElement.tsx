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
import { TitleElement as TitleElementDef } from '@abc-map/shared';
import { ReactElement } from 'react';

type Props = RenderElementProps & { element: TitleElementDef };

export function TitleElement(props: Props) {
  const { level } = props.element;

  let title: ReactElement;
  switch (level) {
    case 1:
      title = <h1>{props.children}</h1>;
      break;
    case 2:
      title = <h2>{props.children}</h2>;
      break;
    case 3:
      title = <h3>{props.children}</h3>;
      break;
    case 4:
      title = <h4>{props.children}</h4>;
      break;
    default:
      title = <h5>{props.children}</h5>;
  }

  return (
    <div {...props.attributes} className={Cls.title}>
      {title}
    </div>
  );
}
