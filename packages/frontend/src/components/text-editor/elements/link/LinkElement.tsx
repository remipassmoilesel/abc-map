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

import Cls from './LinkElement.module.scss';
import { RenderElementProps } from 'slate-react';
import { LinkElement as LinkElementDef } from '../../typings';

type Props = RenderElementProps & { element: LinkElementDef };

/**
 * This is the default element.
 * @param props
 * @constructor
 */
export function LinkElement(props: Props) {
  const { element } = props;

  return (
    <a href={element.url} target={'_blank'} rel="noreferrer" className={Cls.link} {...props.attributes}>
      {props.children}
    </a>
  );
}
