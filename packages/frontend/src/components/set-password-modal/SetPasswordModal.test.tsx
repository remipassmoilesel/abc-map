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
import { ModalEvent, ModalEventType, ShowSetPasswordModal } from '../../core/ui/typings';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SetPasswordModal from './SetPasswordModal';

describe('SetPasswordModal', () => {
  let showModalCmd: ShowSetPasswordModal;
  let services: TestServices;

  beforeEach(() => {
    showModalCmd = { type: ModalEventType.ShowSetPassword, title: 'Password needed', message: 'Enter password' };
    services = newTestServices();
  });

  it('should become visible', () => {
    abcRender(<SetPasswordModal />, { services });

    dispatch(showModalCmd);

    expect(screen.getByText('Password needed')).toBeDefined();
    expect(screen.getByText('Enter password')).toBeDefined();
  });

  it('should have disabled button if confirmation invalid', () => {
    // Prepare
    abcRender(<SetPasswordModal />, { services });
    dispatch(showModalCmd);

    // Act
    userEvent.type(screen.getByTestId('password-input'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1235');

    // Assert
    expect(screen.getByTestId('password-confirm')).toBeDisabled();
  });

  it('should emit after submit', () => {
    // Prepare
    abcRender(<SetPasswordModal />, { services });
    dispatch(showModalCmd);
    userEvent.type(screen.getByTestId('password-input'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');

    // Act
    screen.getByTestId('password-confirm').click();

    // Assert
    expect(services.modals.dispatch.args).toEqual([[{ status: 'Confirmed', type: 'SetPasswordClosed', value: 'azerty1234' }]]);
  });

  it('should not keep state after cancel', () => {
    // Prepare
    abcRender(<SetPasswordModal />, { services });
    dispatch(showModalCmd);
    userEvent.type(screen.getByTestId('password-input'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');

    // Act
    screen.getByTestId('password-cancel').click();
    dispatch(showModalCmd);

    // Assert
    expect(screen.getByTestId('password-input')).toHaveValue('');
    expect(screen.getByTestId('password-confirmation')).toHaveValue('');
  });

  it('should not keep state after confirm', () => {
    // Prepare
    abcRender(<SetPasswordModal />, { services });
    dispatch(showModalCmd);
    userEvent.type(screen.getByTestId('password-input'), 'azerty1234');
    userEvent.type(screen.getByTestId('password-confirmation'), 'azerty1234');

    // Act
    screen.getByTestId('password-confirm').click();
    dispatch(showModalCmd);

    // Assert
    expect(screen.getByTestId('password-input')).toHaveValue('');
    expect(screen.getByTestId('password-confirmation')).toHaveValue('');
  });

  function dispatch(ev: ModalEvent) {
    services.modals.addListener.args[0][1](ev);
  }
});
