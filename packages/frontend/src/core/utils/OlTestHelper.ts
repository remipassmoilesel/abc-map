import { Map } from 'ol';

export class OlTestHelper {
  public static getInteractionCount(map: Map, name: string): number {
    return map
      .getInteractions()
      .getArray()
      .filter((inter) => inter.constructor.name === name).length;
  }

  public static getInteractionNames(map: Map): string[] {
    return map
      .getInteractions()
      .getArray()
      .map((inter) => inter.constructor.name)
      .sort();
  }
}
