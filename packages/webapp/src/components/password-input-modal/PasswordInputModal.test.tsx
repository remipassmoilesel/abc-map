/**
 * Copyright © 2026 Rémi Pace.
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
import type { TestServices } from '../../core/utils/test/TestServices';
import { newTestServices } from '../../core/utils/test/TestServices';
import { abcRender } from '../../core/utils/test/abcRender';
import PasswordInputModal from './PasswordInputModal';
import type { ModalEvent } from '../../core/ui/typings';
import { ModalEventType } from '../../core/ui/typings';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { TestHelper } from '../../core/utils/test/TestHelper';
import { Encryption } from '../../core/utils/Encryption';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PasswordInputModal', () => {
  let services: TestServices;

  beforeEach(async () => {
    services = newTestServices();
  });

  it('should become visible', async () => {
    await act(async () => {
      abcRender(<PasswordInputModal />, { services });
    });

    await openModal();

    expect(screen.getByText('Password needed')).toBeDefined();
    expect(screen.getByText('Enter password')).toBeDefined();
  });

  it('should emit after submit', async () => {
    // Prepare
    await act(async () => {
      abcRender(<PasswordInputModal />, { services });
    });

    await openModal();

    await userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    await userEvent.click(screen.getByTestId('password-confirm'));

    // Assert
    await waitFor(() => {
      expect(services.modals.dispatch.args).toEqual([[{ status: 'Confirmed', type: ModalEventType.PasswordPromptClosed, value: 'azerty1234' }]]);
    });
  });

  it('should not keep state after cancel', async () => {
    // Prepare
    await act(async () => {
      abcRender(<PasswordInputModal />, { services });
    });

    await openModal();

    await userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    await userEvent.click(screen.getByTestId('password-cancel'));

    await openModal();

    // Assert
    expect(screen.getByTestId('password-input')).toHaveValue('');
  });

  it('should not keep state after confirm', async () => {
    // Prepare
    await act(async () => {
      abcRender(<PasswordInputModal />, { services });
    });

    await openModal();

    await userEvent.type(screen.getByTestId('password-input'), 'azerty1234');

    // Act
    await userEvent.click(screen.getByTestId('password-confirm'));

    await TestHelper.wait(10); // Wait internal promise
    await openModal();

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('password-input')).toHaveValue('');
    });
  });

  it('should warn if password is incorrect', async () => {
    // Prepare
    await act(async () => {
      abcRender(<PasswordInputModal />, { services });
    });

    await openModal();

    // Act
    await userEvent.type(screen.getByTestId('password-input'), 'azerty5678');
    await userEvent.click(screen.getByTestId('password-confirm'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/This password is incorrect/)).toBeDefined();
    });
  });

  async function openModal() {
    await act(async () => {
      const witness = await Encryption.encrypt('witness sentence', 'azerty1234');
      const event: ModalEvent = { type: ModalEventType.ShowPasswordInput, title: 'Password needed', message: 'Enter password', witness };
      services.modals.addListener.args[0][1](event);
    });
  }
});
