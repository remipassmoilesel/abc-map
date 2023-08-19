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

import { abcRender } from '../../../../../core/utils/test/abcRender';
import FillPatternButton, { Props } from './FillPatternButton';
import sinon, { SinonStub, SinonStubbedInstance } from 'sinon';
import { FillPatterns } from '@abc-map/shared';
import { FillPatternFactory } from '../../../../../core/geo/styles/FillPatternFactory';
import { render } from '@testing-library/react';

describe('FillPatternButton', () => {
  let factory: SinonStubbedInstance<FillPatternFactory>;
  let handleClick: SinonStub;
  let props: Props;
  beforeEach(() => {
    handleClick = sinon.stub();
    factory = sinon.createStubInstance(FillPatternFactory);
    props = {
      size: 'sm',
      color1: 'white',
      color2: 'black',
      pattern: FillPatterns.Circles,
      onClick: handleClick,
      factory: factory as unknown as FillPatternFactory,
    };
  });

  it('should render', () => {
    factory.create.returns('white' as unknown as CanvasPattern);

    abcRender(<FillPatternButton {...props} />);

    expect(factory.create.args).toEqual([
      [
        {
          color1: 'white',
          color2: 'black',
          pattern: 'abc:style:fill:circles',
        },
      ],
    ]);
  });

  it('should update pattern', () => {
    // Prepare
    factory.create.returns('white' as unknown as CanvasPattern);
    const { rerender } = render(<FillPatternButton {...props} />);
    const newProps = { ...props, pattern: FillPatterns.HatchingHorizontal, color1: 'red' };

    // Act
    rerender(<FillPatternButton {...newProps} />);

    // Assert
    expect(factory.create.callCount).toEqual(2);
    expect(factory.create.args[1]).toEqual([
      {
        color1: 'red',
        color2: 'black',
        pattern: FillPatterns.HatchingHorizontal,
      },
    ]);
  });
});
