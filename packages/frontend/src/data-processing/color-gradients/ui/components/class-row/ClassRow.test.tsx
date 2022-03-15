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
import * as sinon from 'sinon';
import { abcRender } from '../../../../../core/utils/test/abcRender';
import ClassRow from './ClassRow';
import { GradientClass } from '../../../GradientClass';
import { nanoid } from 'nanoid';
import { deepFreeze } from '../../../../../core/utils/deepFreeze';
import { screen } from '@testing-library/react';

let colorChangedHandler: (color: string) => void;
jest.mock('../../../../../components/color-picker/ColorPickerButton', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: function (props: { onClose: (color: string) => void }) {
      colorChangedHandler = props.onClose;
      return <div />;
    },
  };
});

describe('ClassRow', () => {
  let sampleClass: GradientClass;
  beforeEach(() => {
    sampleClass = deepFreeze({
      id: nanoid(),
      color: '#fff',
      lower: 0,
      upper: 10,
    });
  });

  it('should render', () => {
    abcRender(<ClassRow gradientClass={sampleClass} onChange={() => undefined} />);

    expect(screen.getByText(0)).toBeDefined();
    expect(screen.getByText(10)).toBeDefined();
  });

  it('should trigger change after color update', () => {
    // Prepare
    const handleChange = sinon.stub();
    abcRender(<ClassRow gradientClass={sampleClass} onChange={handleChange} />);

    // Act
    colorChangedHandler('#000');

    // Assert
    expect(handleChange.args).toEqual([
      [
        {
          ...sampleClass,
          color: '#000',
        },
      ],
    ]);
  });
});
