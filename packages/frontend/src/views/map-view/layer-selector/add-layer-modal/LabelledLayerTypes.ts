export interface LabelledLayerType {
  id: string;
  label: string;
}

export class LabelledLayerTypes {
  public static readonly Osm: LabelledLayerType = {
    id: 'Osm',
    label: 'Couche OpenStreetMap',
  };

  public static readonly Vector: LabelledLayerType = {
    id: 'Vector',
    label: 'Couche de formes',
  };

  public static readonly Wms: LabelledLayerType = {
    id: 'Wms',
    label: 'Couche distante (WMS)',
  };

  public static readonly All: LabelledLayerType[] = [LabelledLayerTypes.Osm, LabelledLayerTypes.Vector, LabelledLayerTypes.Wms];

  public static find(value: string): LabelledLayerType | undefined {
    return LabelledLayerTypes.All.find((type) => type.id === value);
  }
}
