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
import { EditPropertiesModal, logger } from './EditPropertiesModal';
import { act } from '@testing-library/react';
import { ModalEvent, ModalEventType, ModalStatus } from '../../core/ui/typings';
import { DataPropertiesMap } from '../../core/geo/features/FeatureWrapper';
import userEvent from '@testing-library/user-event';

logger.disable();

describe('EditPropertiesModal', () => {
  let services: TestServices;
  beforeEach(() => {
    services = newTestServices();
  });

  it('edit should work', async () => {
    // Prepare
    const { getByTestId, getAllByTestId } = abcRender(<EditPropertiesModal />, { services });

    // Act
    await openModal({
      'Variable 1': 'Value 1',
      'Variable 2': 'Value 2',
      'Variable 3': 3,
      'Variable 4': null,
      'Variable 5': undefined,
    });

    await act(async () => {
      await userEvent.clear(getAllByTestId('property-value')[0]);
      await userEvent.type(getAllByTestId('property-value')[0], 'New value 1');
      await userEvent.click(getByTestId('confirm'));
    });

    // Assert
    expect(services.modals.dispatch.callCount).toEqual(1);
    expect(services.modals.dispatch.args).toEqual([
      [
        {
          status: ModalStatus.Confirmed,
          type: ModalEventType.FeaturePropertiesClosed,
          properties: {
            'Variable 1': 'New value 1',
            'Variable 2': 'Value 2',
            'Variable 3': 3,
            'Variable 4': null,
            'Variable 5': undefined,
          },
        },
      ],
    ]);
  });

  it('edit should filter unsupported values', async () => {
    // Prepare
    const { getByTestId, getAllByTestId } = abcRender(<EditPropertiesModal />, { services });

    // Act
    await openModal({
      'Variable 1': 'Value 1',
      'Variable 5': ['abc', 'def'] as any,
      'Variable 6': {
        field1: 'value 3',
      } as any,
    });

    await act(async () => {
      await userEvent.clear(getAllByTestId('property-value')[0]);
      await userEvent.type(getAllByTestId('property-value')[0], 'New value 1');
      await userEvent.click(getByTestId('confirm'));
    });

    // Assert
    expect(services.modals.dispatch.callCount).toEqual(1);
    expect(services.modals.dispatch.args).toEqual([
      [
        {
          status: ModalStatus.Confirmed,
          type: ModalEventType.FeaturePropertiesClosed,
          properties: {
            'Variable 1': 'New value 1',
          },
        },
      ],
    ]);
  });

  it('edit should trim names', async () => {
    // Prepare
    const { getByTestId, getAllByTestId } = abcRender(<EditPropertiesModal />, { services });

    // Act
    await openModal({
      'Variable 1': 'Value 1',
    });

    await act(async () => {
      await userEvent.clear(getAllByTestId('property-name')[0]);
      await userEvent.type(getAllByTestId('property-name')[0], '  VARIABLE_1  ');
      await userEvent.click(getByTestId('confirm'));
    });

    // Assert
    expect(services.modals.dispatch.callCount).toEqual(1);
    expect(services.modals.dispatch.args).toEqual([
      [
        {
          status: ModalStatus.Confirmed,
          type: ModalEventType.FeaturePropertiesClosed,
          properties: {
            VARIABLE_1: 'Value 1',
          },
        },
      ],
    ]);
  });

  it('add properties should work', async () => {
    // Prepare
    const { getByTestId, getAllByTestId } = abcRender(<EditPropertiesModal />, { services });

    // Act
    await openModal({
      'Variable 1': 'Value 1',
    });

    await act(async () => {
      await userEvent.click(getByTestId('new-property-button'));
    });

    await act(async () => {
      await userEvent.type(getAllByTestId('property-name')[1], 'VARIABLE_2');
      await userEvent.type(getAllByTestId('property-value')[1], 'VALUE 2');
    });

    await act(async () => {
      await userEvent.click(getByTestId('new-property-button'));
    });

    await act(async () => {
      await userEvent.type(getAllByTestId('property-name')[2], 'VARIABLE_3');
      await userEvent.type(getAllByTestId('property-value')[2], 'VALUE 3');

      await userEvent.click(getByTestId('confirm'));
    });

    // Assert
    expect(services.modals.dispatch.callCount).toEqual(1);
    expect(services.modals.dispatch.args).toEqual([
      [
        {
          status: ModalStatus.Confirmed,
          type: ModalEventType.FeaturePropertiesClosed,
          properties: {
            'Variable 1': 'Value 1',
            VARIABLE_2: 'VALUE 2',
            VARIABLE_3: 'VALUE 3',
          },
        },
      ],
    ]);
  });

  it('create properties should work', async () => {
    // Prepare
    const { getByTestId, getAllByTestId } = abcRender(<EditPropertiesModal />, { services });

    // Act
    await openModal({});

    // First property
    await act(async () => {
      await userEvent.type(getAllByTestId('property-name')[0], 'size');
      await userEvent.type(getAllByTestId('property-value')[0], '12345');
    });

    // Second property
    await act(async () => {
      await userEvent.click(getByTestId('new-property-button'));
    });
    await act(async () => {
      await userEvent.type(getAllByTestId('property-name')[1], 'type');
      await userEvent.type(getAllByTestId('property-value')[1], 'plain');

      await userEvent.click(getByTestId('confirm'));
    });

    // Assert
    expect(services.modals.dispatch.callCount).toEqual(1);
    expect(services.modals.dispatch.args).toEqual([
      [
        {
          status: ModalStatus.Confirmed,
          type: ModalEventType.FeaturePropertiesClosed,
          properties: {
            size: 12345,
            type: 'plain',
          },
        },
      ],
    ]);
  });

  it('delete properties should work', async () => {
    // Prepare
    const { getByTestId, getAllByTestId } = abcRender(<EditPropertiesModal />, { services });

    // Act
    await openModal({
      size: 12345,
      type: 'plain',
      color: 'red',
    });

    // We click twice on second element
    await act(async () => {
      await userEvent.click(getAllByTestId('delete-button')[1]);
    });

    await act(async () => {
      await userEvent.click(getAllByTestId('delete-button')[1]);
    });

    await act(async () => {
      await userEvent.click(getByTestId('confirm'));
    });

    // Assert
    expect(services.modals.dispatch.callCount).toEqual(1);
    expect(services.modals.dispatch.args).toEqual([
      [
        {
          status: ModalStatus.Confirmed,
          type: ModalEventType.FeaturePropertiesClosed,
          properties: {
            size: 12345,
          },
        },
      ],
    ]);
  });

  async function openModal(properties: DataPropertiesMap) {
    await act(() => {
      const ev: ModalEvent = { type: ModalEventType.ShowEditProperties, properties };
      services.modals.addListener.args[0][1](ev);
    });
  }
});
