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

import Cls from './InlineLoader.module.scss';

interface Props {
  // In rem
  size?: number;
  className?: string;
  active: boolean;
}

export function InlineLoader(props: Props) {
  const { size, active, className } = props;

  const color = '#adb5bd';
  const _size = size ?? 2;

  const partsStyle = {
    width: _size * 0.8 + 'rem',
    height: _size * 0.8 + 'rem',
    margin: `${_size * 0.1}rem`,
    border: `${_size * 0.1}rem solid ${color}`,
    borderColor: `${color} transparent transparent transparent`,
  };

  const loaderStyle = { width: _size + 'rem', height: _size + 'rem' };

  return (
    <div className={Cls.ldsRing + (className || '')} style={loaderStyle}>
      {active && (
        <>
          <div style={partsStyle} />
          <div style={partsStyle} />
          <div style={partsStyle} />
          <div style={partsStyle} />
        </>
      )}
    </div>
  );
}
