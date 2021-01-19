export interface AddLayerType {
  id: string;
  label: string;
}

export class AddLayerTypes {
  public static readonly Osm: AddLayerType = {
    id: 'Osm',
    label: 'Couche OpenStreetMap',
  };

  public static readonly Vector: AddLayerType = {
    id: 'Vector',
    label: 'Couche de formes',
  };

  public static readonly Wms: AddLayerType = {
    id: 'Wms',
    label: 'Couche distante (WMS)',
  };

  public static readonly All: AddLayerType[] = [AddLayerTypes.Osm, AddLayerTypes.Vector, AddLayerTypes.Wms];

  public static find(value: string): AddLayerType | undefined {
    return AddLayerTypes.All.find((type) => type.id === value);
  }
}
