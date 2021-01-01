import { Map } from 'ol';

export class OlTestHelper {
  public static getInteractionCountFromMap(map: Map, name: string): number {
    return map
      .getInteractions()
      .getArray()
      .filter((inter) => inter.constructor.name === name).length;
  }
}
