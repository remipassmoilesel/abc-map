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

import { ModalService } from './ModalService';
import { ModalEvent, ModalEventType, ModalStatus, OperationStatus } from './typings';
import * as sinon from 'sinon';
import { TestHelper } from '../utils/test/TestHelper';

describe('ModalService', function () {
  const event: ModalEvent = { type: ModalEventType.FeaturePropertiesClosed, properties: {}, status: ModalStatus.Confirmed };
  let service: ModalService;

  beforeEach(() => {
    service = new ModalService();
  });

  it('addListener()', () => {
    // Prepare
    const listener = sinon.stub();

    // Act
    service.addListener(ModalEventType.FeaturePropertiesClosed, listener);
    service.dispatch(event);

    // Assert
    expect(listener.callCount).toEqual(1);
    expect(listener.args[0][0]).toEqual(event);
  });

  it('removeListener()', () => {
    // Prepare
    const listener = sinon.stub();
    service.addListener(ModalEventType.FeaturePropertiesClosed, listener);

    // Act
    service.removeListener(ModalEventType.FeaturePropertiesClosed, listener);
    service.dispatch(event);

    // Assert
    expect(listener.callCount).toEqual(0);
  });

  describe('longOperationModal()', () => {
    it('should succeed and return status', async () => {
      const listener = sinon.stub();
      service.addListener(ModalEventType.ShowLongOperationModal, listener);
      service.addListener(ModalEventType.LongOperationModalClosed, listener);

      const res = await service.longOperationModal(async () => {
        await TestHelper.wait(200);
        return OperationStatus.Succeed;
      });

      expect(res).toEqual(OperationStatus.Succeed);
      expect(listener.args).toEqual([
        [{ type: ModalEventType.ShowLongOperationModal, processing: true }],
        [{ type: ModalEventType.ShowLongOperationModal, processing: false }],
        [{ type: ModalEventType.LongOperationModalClosed }],
      ]);
    });

    it('should succeed and return result', async () => {
      const listener = sinon.stub();
      service.addListener(ModalEventType.ShowLongOperationModal, listener);
      service.addListener(ModalEventType.LongOperationModalClosed, listener);

      const res = await service.longOperationModal<boolean>(async () => {
        await TestHelper.wait(200);
        return [OperationStatus.Succeed, false];
      });

      expect(res).toEqual(false);
      expect(listener.args).toEqual([
        [{ type: ModalEventType.ShowLongOperationModal, processing: true }],
        [{ type: ModalEventType.ShowLongOperationModal, processing: false }],
        [{ type: ModalEventType.LongOperationModalClosed }],
      ]);
    });

    it('should fail', async () => {
      const listener = sinon.stub();
      service.addListener(ModalEventType.ShowLongOperationModal, listener);
      service.addListener(ModalEventType.LongOperationModalClosed, listener);

      const error: Error = await service
        .longOperationModal(async () => {
          await TestHelper.wait(200);
          return Promise.reject(new Error('Huuooo'));
        })
        .catch((err) => err);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Huuooo');
      expect(listener.args).toEqual([
        [
          {
            type: ModalEventType.ShowLongOperationModal,
            processing: true,
          },
        ],
        [{ type: ModalEventType.LongOperationModalClosed }],
      ]);
    });

    it('should close quickly on interruption', async () => {
      const listener = sinon.stub();
      service.addListener(ModalEventType.ShowLongOperationModal, listener);
      service.addListener(ModalEventType.LongOperationModalClosed, listener);

      const res = await service.longOperationModal(async () => {
        await TestHelper.wait(200);
        return OperationStatus.Interrupted;
      });

      expect(res).toEqual(OperationStatus.Interrupted);
      expect(listener.args).toEqual([
        [
          {
            type: ModalEventType.ShowLongOperationModal,
            processing: true,
          },
        ],
        [{ type: ModalEventType.LongOperationModalClosed }],
      ]);
    });

    it('should return result even on interruption', async () => {
      const listener = sinon.stub();
      service.addListener(ModalEventType.ShowLongOperationModal, listener);
      service.addListener(ModalEventType.LongOperationModalClosed, listener);

      const res = await service.longOperationModal(async () => {
        await TestHelper.wait(200);
        return [OperationStatus.Interrupted, 12345];
      });

      expect(res).toEqual(12345);
      expect(listener.args).toEqual([
        [
          {
            type: ModalEventType.ShowLongOperationModal,
            processing: true,
          },
        ],
        [{ type: ModalEventType.LongOperationModalClosed }],
      ]);
    });
  });
});
