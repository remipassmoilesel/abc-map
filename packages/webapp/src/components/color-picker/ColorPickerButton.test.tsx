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
import { abcRender } from '../../core/utils/test/abcRender';
import ColorPickerButton from './ColorPickerButton';
import sinon, { SinonStub } from 'sinon';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ColorPickerButton', () => {
  let handleClose: SinonStub;
  beforeEach(() => {
    handleClose = sinon.stub();
  });

  it('should render button with initial value (hex)', () => {
    abcRender(<ColorPickerButton value={'#AABBCCDD'} onClose={handleClose} />);

    expect(screen.getByRole('button').style.background).toEqual('rgba(170, 187, 204, 0.867)');
  });

  it('should render button with initial value (rgba)', () => {
    abcRender(<ColorPickerButton value={'rgba(170, 50, 204, 0.87)'} onClose={handleClose} />);

    expect(screen.getByRole('button').style.background).toEqual('rgba(170, 50, 204, 0.87)');
  });

  it('should open modal and set color value (hex)', async () => {
    // Prepare
    abcRender(<ColorPickerButton value={'#AABBCCDD'} onClose={handleClose} />);

    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole('button'));
    });

    // Assert
    await waitFor(() => {
      expect(getModalValue()).toEqual({ a: '87', b: '204', g: '187', hex: 'AABBCC', r: '170' });
    });
  });

  it('should open modal and set color value (rgba)', async () => {
    // Prepare
    abcRender(<ColorPickerButton value={'rgba(170, 50, 204, 0.87)'} onClose={handleClose} />);

    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole('button'));
    });

    // Assert
    await waitFor(() => {
      expect(getModalValue()).toEqual({ a: '87', b: '204', g: '50', hex: 'AA32CC', r: '170' });
    });
  });

  it('should trigger onClose()', async () => {
    // Prepare
    abcRender(<ColorPickerButton value={'#AA32CCDD'} onClose={handleClose} />);
    await act(async () => {
      await userEvent.click(screen.getByRole('button'));
    });

    // Act
    await act(async () => {
      await setModalValue(175, 55, 209, 50);
      await userEvent.click(screen.getByTestId('close-modal'));
    });

    // Assert
    expect(handleClose.args).toEqual([['rgba(175,55,209,0.5)']]);
  });

  function getModalValue() {
    const values = selectModalInputs().map((input) => input.value);

    return {
      hex: values[0],
      r: values[1],
      g: values[2],
      b: values[3],
      a: values[4],
    };
  }

  async function setModalValue(r: number, g: number, b: number, a: number): Promise<void> {
    const inputs = selectModalInputs();
    const typeIn = async (index: number, value: string) => {
      await userEvent.clear(inputs[index]);
      await userEvent.type(inputs[index], value);
    };

    await typeIn(1, `${r}`);
    await typeIn(2, `${g}`);
    await typeIn(3, `${b}`);
    await typeIn(4, `${a}`);
  }

  function selectModalInputs() {
    // At each display ids are incremented, so we select them this way
    return Array.from(document.body.querySelectorAll('input')).filter((input) => input.id.match(/^rc-editable-input/));
  }
});
