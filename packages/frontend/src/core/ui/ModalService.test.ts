import { ModalService } from './ModalService';
import { ModalEvent, ModalEventType, ModalStatus } from './typings';
import * as sinon from 'sinon';

describe('ModalService', function () {
  const event: ModalEvent = { type: ModalEventType.FeaturePropertiesClosed, properties: {}, status: ModalStatus.Confirmed };
  let service: ModalService;

  beforeEach(() => {
    service = new ModalService();
  });

  it('addListener()', () => {
    expect(service.getListeners().size).toEqual(0);
    const listener = sinon.stub();

    service.addListener(ModalEventType.FeaturePropertiesClosed, listener);
    service.dispatch(event);

    expect(service.getListeners().size).toEqual(1);
    expect(service.getListeners().get(listener)).toBeDefined();
    expect(listener.callCount).toEqual(1);
    expect(listener.args[0][0]).toEqual(event);
  });

  it('removeListener()', () => {
    const listener = sinon.stub();
    service.addListener(ModalEventType.FeaturePropertiesClosed, listener);

    service.removeListener(ModalEventType.FeaturePropertiesClosed, listener);
    service.dispatch(event);

    expect(service.getListeners().size).toEqual(0);
    expect(service.getListeners().get(listener)).toBeUndefined();
    expect(listener.callCount).toEqual(0);
  });
});
