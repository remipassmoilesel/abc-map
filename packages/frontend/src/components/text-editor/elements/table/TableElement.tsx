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

import Cls from './TableElement.module.scss';
import { RenderElementProps } from 'slate-react';
import clsx from 'clsx';
import { TableElement as TableElementDef } from '@abc-map/shared';
import { useEditor } from '../../useEditor';

const classes = [Cls.border0, Cls.border1, Cls.border2, Cls.border3];

type Props = RenderElementProps & { element: TableElementDef };

export function TableElement(props: Props) {
  const { children, attributes } = props;
  const { readOnly } = useEditor();
  const { border = 1 } = props.element;

  return (
    <table className={clsx(Cls.table, readOnly && Cls.readOnly, classes[border] ?? classes[0])} {...attributes}>
      <tbody>{children}</tbody>
    </table>
  );
}
