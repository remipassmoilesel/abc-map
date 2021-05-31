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
import { ModalEvent, ModalEventType } from '../../core/ui/typings';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestHelper } from '../../core/utils/test/TestHelper';
import RegistrationModal from './RegistrationModal';

describe('RegistrationModal', () => {
  let services: TestServices;

  beforeEach(() => {
    services = newTestServices();
  });

  it('should become visible', () => {
    abcRender(<RegistrationModal />, { services });

    dispatch({ type: ModalEventType.ShowRegistration });

    expect(screen.getByPlaceholderText('Adresse email')).toBeDefined();
  });

  it('should have disabled button if form is invalid', () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    dispatch({ type: ModalEventType.ShowRegistration });

    // Act
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1235');

    // Assert
    expect(screen.getByTestId('confirm-registration')).toBeDisabled();
  });

  it('should register on submit', () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    dispatch({ type: ModalEventType.ShowRegistration });
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');
    services.authentication.registration.resolves();

    // Act
    screen.getByTestId('confirm-registration').click();

    // Assert
    expect(services.authentication.registration.args).toEqual([['heyhey@hey.com', 'azerty1234']]);
  });

  it('should not keep state after cancel', () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    dispatch({ type: ModalEventType.ShowRegistration });
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');
    services.authentication.registration.resolves();

    // Act
    screen.getByTestId('cancel-registration').click();
    dispatch({ type: ModalEventType.ShowRegistration });

    // Assert
    expect(screen.getByTestId('email')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
    expect(screen.getByTestId('password-confirmation')).toHaveValue('');
  });

  it('should not keep state after confirm', async () => {
    // Prepare
    abcRender(<RegistrationModal />, { services });
    dispatch({ type: ModalEventType.ShowRegistration });
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');
    services.authentication.registration.resolves();

    // Act
    screen.getByTestId('confirm-registration').click();
    await TestHelper.wait(10); // Wait internal promise
    dispatch({ type: ModalEventType.ShowRegistration });

    // Assert
    expect(screen.getByTestId('email')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
    expect(screen.getByTestId('password-confirmation')).toHaveValue('');
  });

  function dispatch(ev: ModalEvent) {
    services.modals.addListener.args[0][1](ev);
  }
});
