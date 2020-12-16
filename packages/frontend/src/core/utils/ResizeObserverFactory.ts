import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';

export class ResizeObserverFactory {
  public static create(handler: () => void): ResizeObserver {
    const constructor = window.ResizeObserver || ResizeObserverPolyfill;
    return new constructor(handler);
  }
}
