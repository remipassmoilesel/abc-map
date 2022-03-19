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

import Cls from './ParagraphElement.module.scss';
import { RenderElementProps } from 'slate-react';
import clsx from 'clsx';
import { ParagraphElement as ParagraphElementDef } from '@abc-map/shared';
import { Element } from 'slate';

type Props = RenderElementProps & { element: Element | ParagraphElementDef };

/**
 * This is the default element.
 * @param props
 * @constructor
 */
export function ParagraphElement(props: Props) {
  const { element } = props;
  const align = 'align' in element && element.align;

  const classes = clsx(
    Cls.paragraph,
    align === 'left' && Cls.alignLeft,
    align === 'center' && Cls.alignCenter,
    align === 'right' && Cls.alignRight,
    align === 'justify' && Cls.alignJustify
  );
  return (
    <div className={classes} {...props.attributes} data-testid={'paragraph'}>
      {props.children}
    </div>
  );
}
