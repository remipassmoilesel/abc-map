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

import { WmsCapabilities } from '../../core/geo/WmsCapabilities';
import { WmtsCapabilities } from '../../core/geo/WmtsCapabilities';

export function wmsCapabilities(): WmsCapabilities {
  return {
    version: '1.3.0',
    Service: {
      Name: 'WMS',
      Title: 'GeoServer Web Map Service',
      Abstract: 'Web Map Service for map access implementing WMS 1.1.1 and WMS 1.3.0. Dyna.....',
      KeywordList: ['WMS', 'GEOSERVER'],
      OnlineResource: 'http://boundlessgeo.com/solutions/solutions-software/geoserver/',
      ContactInformation: {
        ContactPersonPrimary: {
          ContactPerson: 'Fake tile incorporation',
          ContactOrganization: 'Fake tile incorporation',
        },
        ContactPosition: '',
        ContactAddress: {
          AddressType: 'Work',
          Address: 'Gruene Gasse 21d/25',
          City: 'Graz',
          StateOrProvince: '',
          PostCode: '8020',
          Country: 'Austria',
        },
        ContactVoiceTelephone: '+436604376588',
        ContactFacsimileTelephone: '',
        ContactElectronicMailAddress: 'mail@fake.com',
      },
      Fees: 'NONE',
      AccessConstraints: 'NONE',
    },
    Capability: {
      Request: {
        GetCapabilities: {
          Format: ['text/xml'],
          DCPType: [
            {
              HTTP: {
                Get: {
                  OnlineResource: 'http://localhost:3010/wms/public?SERVICE=WMS&',
                },
                Post: {
                  OnlineResource: 'http://localhost:3010/wms/public?SERVICE=WMS&',
                },
              },
            },
          ],
        },
        GetMap: {
          Format: [
            'image/png',
            'image/geotiff',
            'image/geotiff8',
            'image/gif',
            'image/jpeg',
            'image/png; mode=8bit',
            'image/svg+xml',
            'image/tiff',
            'image/tiff8',
            'image/vnd.jpeg-png',
          ],
          DCPType: [
            {
              HTTP: {
                Get: {
                  OnlineResource: 'http://localhost:3010/wms/public?SERVICE=WMS&',
                },
              },
            },
          ],
        },
      },
      Exception: ['XML', 'INIMAGE', 'BLANK', 'JSON'],
      Layer: {
        Title: 'GeoServer Web Map Service',
        CRS: ['EPSG:4326'],
        EX_GeographicBoundingBox: [-179.9999999999999, -89.99999999999994, 180.00000000000014, 83.63410065300015],
        BoundingBox: [
          {
            crs: 'EPSG:4326',
            extent: [-89.99999999999994, -179.9999999999999, 83.63410065300015, 180.00000000000014],
            res: [null, null],
          },
        ],
        Layer: [
          {
            Name: 'first-layer',
            Title: 'First layer',
            Abstract: 'Layer-Group type layer: ne:ne',
            KeywordList: [],
            CRS: ['EPSG:4326', 'EPSG:4326'],
            EX_GeographicBoundingBox: [-179.9999999999999, -89.99999999999994, 180.00000000000014, 83.63410065300015],
            BoundingBox: [
              {
                crs: 'EPSG:4326',
                extent: [-89.99999999999994, -179.9999999999999, 83.63410065300015, 180.00000000000014],
                res: [null, null],
              },
            ],
            queryable: true,
            opaque: false,
            noSubsets: false,
          },
          {
            Name: 'second-layer',
            Title: 'Second layer',
            Abstract: 'Layer-Group type layer: ne:ne',
            KeywordList: [],
            CRS: ['EPSG:4326', 'EPSG:4326'],
            EX_GeographicBoundingBox: [-179.9999999999999, -89.99999999999994, 180.00000000000014, 83.63410065300015],
            BoundingBox: [
              {
                crs: 'EPSG:4326',
                extent: [-89.99999999999994, -179.9999999999999, 83.63410065300015, 180.00000000000014],
                res: [null, null],
              },
            ],
            queryable: true,
            opaque: false,
            noSubsets: false,
          },
        ],
      },
    },
  } as WmsCapabilities;
}

export function wmtsCapabilities(): WmtsCapabilities {
  return {
    ServiceIdentification: {
      Title: 'Fake tile incorporation Labs',
      ServiceType: 'OGC WMTS',
      ServiceTypeVersion: '1.0.0',
    },
    ServiceProvider: {
      ProviderName: 'Fake tile incorporation',
      ProviderSite: 'http://labs.fake-tile-incorporation.com',
      ServiceContact: {},
    },
    OperationsMetadata: {
      GetCapabilities: {
        DCP: {
          HTTP: {
            Get: [
              {
                href: 'http://localhost:3010/wmts/public/WMTSCapabilities.xml?',
                Constraint: [
                  {
                    name: 'GetEncoding',
                    AllowedValues: {
                      Value: ['KVP'],
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      GetFeatureInfo: {
        DCP: {
          HTTP: {
            Get: [
              {
                href: 'http://localhost:3010/wmts/public/?',
                Constraint: [
                  {
                    name: 'GetEncoding',
                    AllowedValues: {
                      Value: ['KVP'],
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    },
    version: '1.0.0',
    Contents: {
      Layer: [
        {
          Title: 'New Zealand Earthquakes',
          Abstract:
            'Historical earthquake data, accessed via the [GeoNet WFS feed](http://info.geonet.org.nz/display/appdata/Advanced+Queries). The data has...',
          Identifier: 'layer-7328',
          WGS84BoundingBox: [-180, -49.454297, 180, -31.16],
          Style: [
            {
              Title: 'Weighted point styles',
              Identifier: 'style=39',
              isDefault: true,
            },
          ],
          Format: ['image/png'],
          TileMatrixSetLink: [
            {
              TileMatrixSet: 'EPSG:3857',
            },
          ],
          ResourceURL: [
            {
              format: 'image/png',
              template: 'http://localhost:3010/wmts/public/layer=7328,{style}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
              resourceType: 'tile',
            },
            {
              format: 'application/json',
              template: 'http://localhost:3010/wmts/public/layer=7328/featureinfo/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}/{I}/{J}.json',
              resourceType: 'FeatureInfo',
            },
            {
              format: 'text/html',
              template: 'http://localhost:3010/wmts/public/layer=7328/featureinfo/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}/{I}/{J}.html',
              resourceType: 'FeatureInfo',
            },
          ],
        },
        {
          Title: 'Australia Earthquakes',
          Abstract:
            'Historical earthquake data, accessed via the [GeoNet WFS feed](http://info.geonet.org.nz/display/appdata/Advanced+Queries). The data has...',
          Identifier: 'layer-7329',
          WGS84BoundingBox: [-180, -49.454297, 180, -31.16],
          Style: [
            {
              Title: 'Weighted point styles',
              Identifier: 'style=39',
              isDefault: true,
            },
          ],
          Format: ['image/png'],
          TileMatrixSetLink: [
            {
              TileMatrixSet: 'EPSG:3857',
            },
          ],
          ResourceURL: [
            {
              format: 'image/png',
              template: 'http://localhost:3010/wmts/public/layer=7328,{style}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
              resourceType: 'tile',
            },
            {
              format: 'application/json',
              template: 'http://localhost:3010/wmts/public/layer=7328/featureinfo/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}/{I}/{J}.json',
              resourceType: 'FeatureInfo',
            },
            {
              format: 'text/html',
              template: 'http://localhost:3010/wmts/public/layer=7328/featureinfo/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}/{I}/{J}.html',
              resourceType: 'FeatureInfo',
            },
          ],
        },
      ],
      TileMatrixSet: [
        {
          Identifier: 'EPSG:3857',
          BoundingBox: [-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789],
          SupportedCRS: 'urn:ogc:def:crs:EPSG::3857',
          WellKnownScaleSet: 'urn:ogc:def:wkss:OGC:1.0:GoogleMapsCompatible',
          TileMatrix: [
            {
              Identifier: '0',
              ScaleDenominator: 559082264.029,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 1,
              MatrixHeight: 1,
            },
            {
              Identifier: '1',
              ScaleDenominator: 279541132.014,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 2,
              MatrixHeight: 2,
            },
            {
              Identifier: '2',
              ScaleDenominator: 139770566.007,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 4,
              MatrixHeight: 4,
            },
            {
              Identifier: '3',
              ScaleDenominator: 69885283.0036,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 8,
              MatrixHeight: 8,
            },
            {
              Identifier: '4',
              ScaleDenominator: 34942641.5018,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 16,
              MatrixHeight: 16,
            },
            {
              Identifier: '5',
              ScaleDenominator: 17471320.7509,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 32,
              MatrixHeight: 32,
            },
            {
              Identifier: '6',
              ScaleDenominator: 8735660.37545,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 64,
              MatrixHeight: 64,
            },
            {
              Identifier: '7',
              ScaleDenominator: 4367830.18772,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 128,
              MatrixHeight: 128,
            },
            {
              Identifier: '8',
              ScaleDenominator: 2183915.09386,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 256,
              MatrixHeight: 256,
            },
            {
              Identifier: '9',
              ScaleDenominator: 1091957.54693,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 512,
              MatrixHeight: 512,
            },
            {
              Identifier: '10',
              ScaleDenominator: 545978.773466,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 1024,
              MatrixHeight: 1024,
            },
            {
              Identifier: '11',
              ScaleDenominator: 272989.386733,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 2048,
              MatrixHeight: 2048,
            },
            {
              Identifier: '12',
              ScaleDenominator: 136494.693366,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 4096,
              MatrixHeight: 4096,
            },
            {
              Identifier: '13',
              ScaleDenominator: 68247.3466832,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 8192,
              MatrixHeight: 8192,
            },
            {
              Identifier: '14',
              ScaleDenominator: 34123.6733416,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 16384,
              MatrixHeight: 16384,
            },
            {
              Identifier: '15',
              ScaleDenominator: 17061.8366708,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 32768,
              MatrixHeight: 32768,
            },
            {
              Identifier: '16',
              ScaleDenominator: 8530.9183354,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 65536,
              MatrixHeight: 65536,
            },
            {
              Identifier: '17',
              ScaleDenominator: 4265.4591677,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 131072,
              MatrixHeight: 131072,
            },
            {
              Identifier: '18',
              ScaleDenominator: 2132.72958385,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 262144,
              MatrixHeight: 262144,
            },
            {
              Identifier: '19',
              ScaleDenominator: 1066.36479192,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 524288,
              MatrixHeight: 524288,
            },
            {
              Identifier: '20',
              ScaleDenominator: 533.182395962,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 1048576,
              MatrixHeight: 1048576,
            },
            {
              Identifier: '21',
              ScaleDenominator: 266.591197981,
              TopLeftCorner: [-20037508.3428, 20037508.3428],
              TileWidth: 256,
              TileHeight: 256,
              MatrixWidth: 2097152,
              MatrixHeight: 2097152,
            },
          ],
        },
      ],
    },
  } as WmtsCapabilities;
}
