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
import { newTestServices, TestServices } from '../../core/utils/test/TestServices';
import { abcRender } from '../../core/utils/test/abcRender';
import PasswordInputModal from './PasswordInputModal';
import { ModalEvent, ModalEventType, ShowPasswordInputModal } from '../../core/ui/typings';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Encryption } from '../../core/utils/Encryption';
import { TestHelper } from '../../core/utils/test/TestHelper';

describe('PasswordInputModal', () => {
  let showCmd: ShowPasswordInputModal;
  let services: TestServices;

  beforeEach(async () => {
    const witness = await Encryption.encrypt('witness sentence', 'azerty1234');
    showCmd = { type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password', witness };
    services = newTestServices();
  });

  it('should become visible', () => {
    abcRender(<PasswordInputModal />, { services });

    dispatch(showCmd);

    expect(screen.getByText('Password needed')).toBeDefined();
    expect(screen.getByText('Enter password')).toBeDefined();
  });

  it('should emit after submit', async () => {
    // Prepare
    abcRender(<PasswordInputModal />, { services });
    dispatch(showCmd);
    await userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    screen.getByTestId('password-confirm').click();

    // Assert
    await waitFor(() => {
      expect(services.modals.dispatch.args).toEqual([[{ status: 'Confirmed', type: 'PasswordInputClosed', value: 'azerty1234' }]]);
    });
  });

  it('should not keep state after cancel', async () => {
    // Prepare
    abcRender(<PasswordInputModal />, { services });
    dispatch(showCmd);
    await userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    screen.getByTestId('password-cancel').click();
    dispatch(showCmd);

    // Assert
    expect(screen.getByTestId('password-input')).toHaveValue('');
  });

  it('should not keep state after confirm', async () => {
    // Prepare
    abcRender(<PasswordInputModal />, { services });
    dispatch(showCmd);
    await userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    screen.getByTestId('password-confirm').click();
    await TestHelper.wait(10); // Wait internal promise
    dispatch(showCmd);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('password-input')).toHaveValue('');
    });
  });

  it('should warn if password is incorrect', async () => {
    // Prepare
    abcRender(<PasswordInputModal />, { services });
    dispatch(showCmd);

    // Act
    await userEvent.type(screen.getByTestId('password-input'), 'azerty5678');
    screen.getByTestId('password-confirm').click();

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/This password is incorrect/)).toBeDefined();
    });
  });

  function dispatch(ev: ModalEvent) {
    services.modals.addListener.args[0][1](ev);
  }
});
