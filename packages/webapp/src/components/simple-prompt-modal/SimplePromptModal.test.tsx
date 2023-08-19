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
import { SimplePromptModal } from './SimplePromptModal';

describe('SimplePromptModal', () => {
  let services: TestServices;

  beforeEach(async () => {
    services = newTestServices();
  });

  it('should become visible', async () => {
    abcRender(<SimplePromptModal />, { services });

    await openModal();

    expect(screen.getByText('Edit project name')).toBeDefined();
    expect(screen.getByTestId('prompt-input')).toHaveValue('Project 1/2/3');
  });

  it('should emit after submit', async () => {
    // Prepare
    abcRender(<SimplePromptModal />, { services });
    await openModal();

    await act(async () => {
      await userEvent.clear(screen.getByTestId('prompt-input'));
      await userEvent.type(screen.getByTestId('prompt-input'), 'Project 4/5/6');
    });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('prompt-confirm'));
    });

    // Assert
    await waitFor(() => {
      expect(services.modals.dispatch.args).toEqual([[{ status: 'Confirmed', type: 'SimplePromptClosed', value: 'Project 4/5/6' }]]);
    });
  });

  it('should reset state on event', async () => {
    // Prepare
    abcRender(<SimplePromptModal />, { services });
    await openModal();

    await act(async () => {
      await userEvent.clear(screen.getByTestId('prompt-input'));
      await userEvent.type(screen.getByTestId('prompt-input'), 'Project 4/5/6');
    });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('prompt-cancel'));
    });

    await openModal();

    // Assert
    expect(screen.getByTestId('prompt-input')).toHaveValue('Project 1/2/3');
  });

  it('should warn if prompt is incorrect', async () => {
    // Prepare
    abcRender(<SimplePromptModal />, { services });
    await openModal();

    // Act
    await act(async () => {
      await userEvent.clear(screen.getByTestId('prompt-input'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Not valid/)).toBeDefined();
    });
  });

  async function openModal() {
    await act(async () => {
      const event: ModalEvent = {
        type: ModalEventType.ShowSimplePrompt,
        title: 'Edit project name',
        message: 'Enter the project name',
        value: 'Project 1/2/3',
        validationErrorMessage: 'Not valid',
        validationRegexp: /[a-z0-9/ ]+/gi,
      };
      services.modals.addListener.args[0][1](event);
    });
  }
});
