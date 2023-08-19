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
import { newTestServices, TestServices } from '../../core/utils/test/TestServices';
import { abcRender } from '../../core/utils/test/abcRender';
import { ModalEvent, ModalEventType } from '../../core/ui/typings';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestHelper } from '../../core/utils/test/TestHelper';
import RegistrationModal from './RegistrationModal';

describe('RegistrationModal', () => {
  let services: TestServices;

  beforeEach(() => {
    services = newTestServices();
  });

  it('should become visible', async () => {
    abcRender(<RegistrationModal />, { services });

    await openModal();

    expect(screen.getByPlaceholderText('Email address')).toBeDefined();
  });

  it('should have disabled button if form is invalid', async () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    await openModal();

    // Act
    await act(async () => {
      await userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
      await userEvent.type(screen.getByTestId('password'), 'azerty1234');
      await userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1235');
    });

    // Assert
    expect(screen.getByTestId('submit-registration')).toBeDisabled();
  });

  it('should register on submit then show confirm button', async () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    await openModal();

    await act(async () => {
      await userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
      await userEvent.type(screen.getByTestId('password'), 'azerty1234');
      await userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');
    });

    services.authentication.registration.resolves();

    // Act
    screen.getByTestId('submit-registration').click();

    // Assert
    expect(services.authentication.registration.args).toEqual([['heyhey@hey.com', 'azerty1234']]);
    await waitFor(() => {
      expect(screen.getByTestId('confirm-registration')).toBeDefined();
    });
  });

  it('should not keep state after cancel', async () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    await openModal();

    await act(async () => {
      await userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
      await userEvent.type(screen.getByTestId('password'), 'azerty1234');
      await userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');
    });

    services.authentication.registration.resolves();

    // Act
    await act(() => {
      screen.getByTestId('cancel-registration').click();
    });
    await openModal();

    // Assert
    expect(screen.getByTestId('email')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
    expect(screen.getByTestId('password-confirmation')).toHaveValue('');
  });

  it('should not keep state after confirm', async () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    await openModal();

    await act(async () => {
      await userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
      await userEvent.type(screen.getByTestId('password'), 'azerty1234');
      await userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');
    });

    services.authentication.registration.resolves();

    // Act
    await act(async () => {
      screen.getByTestId('submit-registration').click();
      await TestHelper.wait(10); // Wait internal promise
    });

    await openModal();

    // Assert
    expect(screen.getByTestId('email')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
    expect(screen.getByTestId('password-confirmation')).toHaveValue('');
  });

  async function openModal() {
    await act(() => {
      const ev: ModalEvent = { type: ModalEventType.ShowRegistration };
      services.modals.addListener.args[0][1](ev);
    });
  }
});
