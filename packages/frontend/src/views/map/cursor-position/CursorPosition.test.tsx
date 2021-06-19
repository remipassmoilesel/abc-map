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

import { render, screen } from '@testing-library/react';
import CursorPosition from './CursorPosition';

describe('CursorPosition', () => {
  it('should render', () => {
    const position = [1.111111118, 2.11111119];
    render(<CursorPosition position={position} />);

    expect(screen.getByText('Position du curseur')).toBeDefined();
    expect(screen.getByText((t) => !!t.match(/Longitude.+1\.111/))).toBeDefined();
    expect(screen.getByText((t) => !!t.match(/Latitude.+2\.111/))).toBeDefined();
  });
});
