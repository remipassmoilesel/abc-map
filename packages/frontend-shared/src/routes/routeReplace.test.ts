import { routeReplace } from './routeReplace';

describe('routeReplace', () => {
  it('should replace nothing', () => {
    const actual = routeReplace('/sample/route/:param', {});
    expect(actual).toEqual('/sample/route/:param');
  });

  it('should replace nothing', () => {
    const param = undefined;
    const actual = routeReplace('/sample/route/:param', { param });
    expect(actual).toEqual('/sample/route/:param');
  });

  it('should replace params', () => {
    const actual = routeReplace('/sample/route/:param1/:param2', { param1: 'value1', param2: 'value2' });
    expect(actual).toEqual('/sample/route/value1/value2');
  });

  it('should replace param', () => {
    const actual = routeReplace('/sample/route/:param1', { param1: '' });
    expect(actual).toEqual('/sample/route/');
  });

  it('should replace optional param', () => {
    const actual = routeReplace('/sample/route/:param1?', { param1: '' });
    expect(actual).toEqual('/sample/route/');
  });
});
