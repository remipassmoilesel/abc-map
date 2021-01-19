import { onlyMainButton } from './common-conditions';

describe('common-conditions', () => {
  it('onlyMainButton()', () => {
    const event1 = {
      originalEvent: {
        button: 0,
      },
    };
    expect(onlyMainButton(event1 as any)).toBeTruthy();

    const event2 = {
      originalEvent: {
        button: 1,
      },
    };
    expect(onlyMainButton(event2 as any)).toBeFalsy();

    const event3 = {
      originalEvent: {},
    };
    expect(onlyMainButton(event3 as any)).toBeFalsy();
  });
});
