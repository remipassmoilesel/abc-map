import { assert } from 'chai';
import { FastifyRequest } from 'fastify';
import { isItWorthLogging } from './isItWorthLogging';

describe('isItWorthLogging()', () => {
  it('should work', () => {
    assert.isTrue(isItWorthLogging(fakeRequest()));
    assert.isTrue(isItWorthLogging(fakeRequest({ url: '/', headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })));
    assert.isTrue(isItWorthLogging(fakeRequest({ url: '/api/authentication', headers: { 'user-agent': 'Go-http-client/1.0' } })));

    assert.isFalse(isItWorthLogging(fakeRequest({ url: '/api/health', headers: { 'user-agent': 'kube-probe/1.0' } })));
    assert.isFalse(isItWorthLogging(fakeRequest({ url: '/api/health', headers: { 'user-agent': 'kube-probe/1.21' } })));
  });

  function fakeRequest(source?: Partial<FastifyRequest>): FastifyRequest {
    return { ...source, headers: { ...source?.headers } } as unknown as FastifyRequest;
  }
});
