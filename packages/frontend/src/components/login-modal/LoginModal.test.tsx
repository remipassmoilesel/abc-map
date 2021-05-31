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
import LoginModal from './LoginModal';
import { TestHelper } from '../../core/utils/test/TestHelper';

describe('LoginModal', () => {
  let services: TestServices;

  beforeEach(() => {
    services = newTestServices();
  });

  it('should become visible', () => {
    abcRender(<LoginModal />, { services });

    dispatch({ type: ModalEventType.ShowLogin });

    expect(screen.getByPlaceholderText('Adresse email')).toBeDefined();
  });

  it('should have disabled button if form is invalid', () => {
    // Prepare
    abcRender(<LoginModal />, { services });
    dispatch({ type: ModalEventType.ShowLogin });

    // Act
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty');

    // Assert
    expect(screen.getByTestId('confirm-login')).toBeDisabled();
  });

  it('should authenticate on submit', () => {
    // Prepare
    abcRender(<LoginModal />, { services });
    dispatch({ type: ModalEventType.ShowLogin });
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty1234');
    services.authentication.login.resolves();

    // Act
    screen.getByTestId('confirm-login').click();

    // Assert
    expect(services.authentication.login.args).toEqual([['heyhey@hey.com', 'azerty1234']]);
  });

  it('should not keep state after cancel', () => {
    // Prepare
    abcRender(<LoginModal />, { services });
    dispatch({ type: ModalEventType.ShowLogin });
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty1234');
    services.authentication.login.resolves();

    // Act
    screen.getByTestId('cancel-login').click();
    dispatch({ type: ModalEventType.ShowLogin });

    // Assert
    expect(screen.getByTestId('email')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
  });

  it('should not keep state after confirm', async () => {
    // Prepare
    abcRender(<LoginModal />, { services });
    dispatch({ type: ModalEventType.ShowLogin });
    userEvent.type(screen.getByTestId('email'), 'heyhey@hey.com');
    userEvent.type(screen.getByTestId('password'), 'azerty1234');
    services.authentication.login.resolves();

    // Act
    screen.getByTestId('confirm-login').click();
    await TestHelper.wait(10); // Wait internal promise
    dispatch({ type: ModalEventType.ShowLogin });

    // Assert
    expect(screen.getByTestId('email')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
  });

  function dispatch(ev: ModalEvent) {
    services.modals.addListener.args[0][1](ev);
  }
});
