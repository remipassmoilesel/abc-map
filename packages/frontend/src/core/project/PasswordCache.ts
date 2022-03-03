import debounce from 'lodash/debounce';

/**
 * This class keep password in memory for a limited amount of time.
 *
 * It is used to prevent too many password prompts for one projet.
 */
export class PasswordCache {
  private value?: string;

  constructor(private expirationMs = 10 * 60 * 1000) {}

  public set(value: string) {
    this.debouncedReset();
    this.value = value;
  }

  public get(): string | undefined {
    this.debouncedReset();
    return this.value;
  }

  private debouncedReset = debounce(() => this.reset(), this.expirationMs);

  public reset() {
    this.value = undefined;
  }
}
