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

import { Youtube } from './Youtube';
import { render } from '@testing-library/react';

describe('Youtube', () => {
  let provider: Youtube;
  beforeEach(() => {
    provider = new Youtube();
  });

  it('should handle', () => {
    expect(provider.canHandle('https://youtu.be/uTC1mW4ua74')).toBe(true);
    expect(provider.canHandle('https://www.youtube.com/watch?v=uTC1mW4ua74')).toBe(true);
    expect(provider.canHandle('https://docs.slatejs.org/api/nodes')).toBe(false);
  });

  it('should return integration for short url', () => {
    const { container } = render(<div>{provider.getIntegration('https://youtu.be/uTC1mW4ua74')}</div>);
    expect(container).toMatchSnapshot();
  });

  it('should return integration for long url', () => {
    const { container } = render(<div>{provider.getIntegration('https://www.youtube.com/watch?v=uTC1mW4ua74')}</div>);
    expect(container).toMatchSnapshot();
  });

  it('should work with https://youtu.be/tEpMEl-_syY', () => {
    const { container } = render(<div>{provider.getIntegration('https://youtu.be/tEpMEl-_syY')}</div>);
    expect(container).toMatchSnapshot();
  });
});
