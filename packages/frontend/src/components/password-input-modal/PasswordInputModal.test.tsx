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
import { ModalEvent, ModalEventType } from '../../core/ui/typings';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PasswordInputModal', () => {
  let services: TestServices;

  beforeEach(() => {
    services = newTestServices();
  });

  it('should become visible', () => {
    abcRender(<PasswordInputModal />, { services });

    dispatch({ type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password' });

    expect(screen.getByText('Password needed')).toBeDefined();
    expect(screen.getByText('Enter password')).toBeDefined();
  });

  it('should emit after submit', () => {
    // Prepare
    abcRender(<PasswordInputModal />, { services });
    dispatch({ type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password' });
    userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    screen.getByTestId('password-confirm').click();

    // Assert
    expect(services.modals.dispatch.args).toEqual([[{ status: 'Confirmed', type: 'PasswordInputClosed', value: 'azerty1234' }]]);
  });

  it('should not keep state after cancel', () => {
    // Prepare
    abcRender(<PasswordInputModal />, { services });
    dispatch({ type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password' });
    userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    screen.getByTestId('password-cancel').click();
    dispatch({ type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password' });

    // Assert
    expect(screen.getByTestId('password-input')).toHaveValue('');
  });

  it('should not keep state after confirm', () => {
    // Prepare
    abcRender(<PasswordInputModal />, { services });
    dispatch({ type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password' });
    userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    screen.getByTestId('password-confirm').click();
    dispatch({ type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password' });

    // Assert
    expect(screen.getByTestId('password-input')).toHaveValue('');
  });

  function dispatch(ev: ModalEvent) {
    services.modals.addListener.args[0][1](ev);
  }
});
