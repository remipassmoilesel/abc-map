export interface WmsCapabilities {
  Capability: WmsCapability;
  Service: WmsServiceInfo;
  version: string;
}

export interface WmsServiceInfo {
  Title: string;
  Abstract: string;
  AccessConstraints: string;
  ContactInformation: {
    ContactPersonPrimary: any;
    ContactPosition: any;
    ContactAddress: any;
    ContactVoiceTelephone: string;
    ContactFacsimileTelephone: string;
  };
  Fees: string;
  KeywordList: string[];
  Name: string;
  OnlineResource: string;
}

export interface WmsCapability {
  Request: WmsRequestInfo;
  Exception: string[];
  Layer: WmsLayerInfo;
}

export interface WmsRequestInfo {
  GetCapabilities: any;
  GetMap: any;
  GetFeatureInfo: any;
}

export interface WmsLayerInfo {
  Title: string;
  Abstract: string;
  CRS: string[];
  Layer: WmsLayer[];
}

export interface WmsLayer {
  Name: string;
  Title: string;
  Abstract: string;
  KeywordList: string[];
  CRS: string[];
  EX_GeographicBoundingBox: number[];
  BoundingBox: WmsBoundingBox[];
  queryable: boolean;
  opaque: boolean;
  noSubsets: boolean;
}

export interface WmsBoundingBox {
  crs: string;
  extent: [number, number, number, number];
  res: number | null[];
}
