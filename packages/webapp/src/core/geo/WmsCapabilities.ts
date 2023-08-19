/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */
import { WMSCapabilities as WMSCapabilitiesParser } from 'ol/format';

export function parseWmsCapabilities(data: string): WmsCapabilities | undefined {
  const document = new DOMParser().parseFromString(data, 'application/xml');
  const parser = new WMSCapabilitiesParser();
  return parser.read(document);
}

export interface WmsCapabilities {
  Capability?: WmsCapability;
  Service?: WmsServiceInfo;
  version?: string;
}

export interface WmsServiceInfo {
  Title?: string;
  Abstract?: string;
  AccessConstraints?: string;
  ContactInformation?: {
    ContactPersonPrimary?: any;
    ContactPosition?: any;
    ContactAddress?: any;
    ContactVoiceTelephone?: string;
    ContactFacsimileTelephone?: string;
    ContactElectronicMailAddress?: string;
  };
  Fees?: string;
  KeywordList?: string[];
  Name?: string;
  OnlineResource?: string;
}

export interface WmsCapability {
  Request?: WmsRequestInfo;
  Exception?: string[];
  Layer?: WmsLayerInfo;
}

export interface WmsRequestInfo {
  GetCapabilities?: WmsGetCapabilityInfo;
  GetMap?: WmsGetCapabilityInfo;
  GetFeatureInfo?: WmsGetCapabilityInfo;
}

export interface WmsGetCapabilityInfo {
  Format?: string[];
  DCPType?: {
    // TODO: complete
    HTTP?: {
      Get?: {
        OnlineResource?: string;
      };
      Post?: {
        OnlineResource?: string;
      };
    };
  }[];
}

export interface WmsLayerInfo {
  Title?: string;
  Abstract?: string;
  CRS?: string[];
  EX_GeographicBoundingBox?: number[];
  Layer?: WmsLayer[];
}

export interface WmsLayer {
  Name?: string;
  Title?: string;
  Abstract?: string;
  KeywordList?: string[];
  CRS?: string[];
  EX_GeographicBoundingBox?: number[];
  BoundingBox?: WmsBoundingBox[];
  queryable?: boolean;
  opaque?: boolean;
  noSubsets?: boolean;
}

export interface WmsBoundingBox {
  crs?: string;
  extent?: [number, number, number, number];
  res?: number | null[];
}
