export abstract class AbstractService {
  public init(): Promise<void> {
    return Promise.resolve();
  }
}
