import { HttpClientFactory, logger, tileLoadAuthenticated } from './tileLoadAuthenticated';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { ImageTile, Tile, VectorTile } from 'ol';
import { TestHelper } from '../../utils/TestHelper';
import TileState from 'ol/TileState';

logger.disable();

describe('tileLoadAuthenticated', () => {
  let factoryStub: SinonStub;

  beforeEach(() => {
    factoryStub = sinon.stub();
    global.URL.createObjectURL = jest.fn(() => 'http://test-object-url');
  });

  it('function setup should include credentials', () => {
    tileLoadAuthenticated({ username: 'test-username', password: 'test-password' }, (factoryStub as unknown) as HttpClientFactory);
    expect(factoryStub.callCount).toEqual(1);
    expect(factoryStub.getCalls()[0].args).toEqual([
      {
        timeout: 10_000,
        responseType: 'blob',
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      },
    ]);
  });

  it('load should set image', async () => {
    const clientStub = {
      get: sinon.stub(),
    };
    clientStub.get.returns(Promise.resolve({}));
    factoryStub.returns(clientStub);

    const tileStub = sinon.createStubInstance(ImageTile);
    const tileImage = document.createElement('img');
    tileStub.getImage.returns(tileImage as HTMLImageElement);

    const load = tileLoadAuthenticated({ username: 'test-username', password: 'test-password' }, (factoryStub as unknown) as HttpClientFactory);
    load((tileStub as unknown) as Tile, 'http://test-url');
    await TestHelper.wait(10); // We wait here because of an internal promise

    expect(clientStub.get.callCount).toEqual(1);
    expect(tileImage.getAttribute('src')).toEqual('http://test-object-url');
  });

  it('load should set status as error if request fail', async () => {
    const clientStub = {
      get: sinon.stub(),
    };
    clientStub.get.returns(Promise.reject(new Error('Test error')));
    factoryStub.returns(clientStub);

    const tileStub = sinon.createStubInstance(ImageTile);

    const func = tileLoadAuthenticated({ username: 'test-username', password: 'test-password' }, (factoryStub as unknown) as HttpClientFactory);
    func((tileStub as unknown) as Tile, 'http://test-url');
    await TestHelper.wait(10); // We wait here because of an internal promise

    expect(clientStub.get.callCount).toEqual(1);
    expect(tileStub.setState.callCount).toEqual(1);
    expect(tileStub.setState.getCalls()[0].args).toEqual([TileState.ERROR]);
  });

  it('load should set status as error if tile is incorrect', async () => {
    const clientStub = {
      get: sinon.stub(),
    };
    clientStub.get.returns(Promise.resolve({}));
    factoryStub.returns(clientStub);

    const tileStub = sinon.createStubInstance(VectorTile);

    const func = tileLoadAuthenticated({ username: 'test-username', password: 'test-password' }, (factoryStub as unknown) as HttpClientFactory);
    func((tileStub as unknown) as Tile, 'http://test-url');
    await TestHelper.wait(10); // We wait here because of an internal promise

    expect(clientStub.get.callCount).toEqual(1);
    expect(tileStub.setState.callCount).toEqual(1);
    expect(tileStub.setState.getCalls()[0].args).toEqual([TileState.ERROR]);
  });
});
