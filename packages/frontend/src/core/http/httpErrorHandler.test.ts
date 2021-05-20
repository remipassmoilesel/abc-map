import { SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { ToastService } from '../ui/ToastService';
import { httpErrorHandler } from './httpErrorHandler';
import { AxiosError } from 'axios';

describe('httpErrorHandler', () => {
  let toasts: SinonStubbedInstance<ToastService>;

  beforeEach(() => {
    toasts = sinon.createStubInstance(ToastService);
  });

  it('Forbidden', async () => {
    const error: Error = (await httpErrorHandler(toasts, fakeAxiosError('Forbidden', 403)).catch((err) => err)) as Error;

    expect(error.message).toEqual('Forbidden');
    expect(toasts.error.callCount).toEqual(1);
    expect(toasts.error.args[0][0]).toEqual('Cette opération est interdite.');
  });

  it('Too Many Requests', async () => {
    const error: Error = (await httpErrorHandler(toasts, fakeAxiosError('TooManyRequests', 429)).catch((err) => err)) as Error;

    expect(error.message).toEqual('TooManyRequests');
    expect(toasts.error.callCount).toEqual(1);
    expect(toasts.error.args[0][0]).toEqual('Vous avez dépassé le nombre de demandes autorisés, veuillez réessayer plus tard.');
  });

  it('Too Many Requests with x-ratelimit-reset', async () => {
    const error: Error = (await httpErrorHandler(toasts, fakeAxiosError('TooManyRequests', 429, { 'x-ratelimit-reset': '1800' })).catch((err) => err)) as Error;

    expect(error.message).toEqual('TooManyRequests');
    expect(toasts.error.callCount).toEqual(1);
    expect(toasts.error.args[0][0]).toEqual('Vous avez dépassé le nombre de demandes autorisés, veuillez réessayer dans 30 minute(s).');
  });
});

function fakeAxiosError(message: string, code: number, headers?: any): AxiosError {
  return { message, response: { status: code, headers: { ...headers } } } as any;
}
