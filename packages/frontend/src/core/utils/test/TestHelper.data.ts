/**
 * Copyright © 2021 Rémi Pace.
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
import { WmtsCapabilities } from '../../geo/WmtsCapabilities';
import { WmsCapabilities } from '../../geo/WmsCapabilities';

export const RegionsOfMetropolitanFrance = () => [
  {
    _id: 1,
    code: 11, // Code is arbitrary
    name: 'Auvergne-Rhône-Alpes',
    population: '8 092 598', // The first numbers are intentionally formatted differently
    popPercent: '0,124',
  },
  {
    _id: 2,
    code: 22,
    name: 'Bourgogne-Franche-Comté',
    population: '2 786 205',
    popPercent: '0,043',
  },
  {
    _id: 3,
    code: 33,
    name: 'Bretagne',
    population: '3 371 297',
    popPercent: '0,051',
  },
  {
    _id: 4,
    code: 44,
    name: 'Centre - Val de Loire',
    population: 2_562_431,
    popPercent: 0.039,
  },
  {
    _id: 5,
    code: 55,
    name: 'Corse',
    population: 349_273,
    popPercent: 0.005,
  },
  {
    _id: 6,
    code: 66,
    name: 'Grand Est',
    population: 5_524_817,
    popPercent: 0.084,
  },
  {
    _id: 7,
    code: 77,
    name: 'Hauts-de-France',
    population: 5_977_462,
    popPercent: 0.091,
  },
  {
    _id: 8,
    code: 88,
    name: 'Île-de-France',
    population: 12_326_429,
    popPercent: 0.188,
  },
  {
    _id: 9,
    code: 99,
    name: 'Normandie',
    population: 3_306_092,
    popPercent: 0.05,
  },
  {
    _id: 10,
    code: 910,
    name: 'Nouvelle Aquitaine',
    population: 6_039_767,
    popPercent: 0.092,
  },
  {
    _id: 11,
    code: 911,
    name: 'Occitanie',
    population: 5_985_751,
    popPercent: 0.091,
  },
  {
    _id: 12,
    code: 912,
    name: 'Pays de la Loire',
    population: 3_838_060,
    popPercent: 0.058,
  },
  {
    _id: 13,
    code: 913,
    name: 'Provence-Alpes-Côte d’Azur',
    population: 5_089_661,
    popPercent: 0.078,
  },
];

export const SampleWmsCapabilities = (): WmsCapabilities => ({
  version: '1.3.0',
  Service: {
    Name: 'WMS',
    Title: 'GeoServer Web Map Service',
    Abstract: 'Web Map Service for map access implementing WMS 1.1.1 and WMS 1.3.0. Dynamic styling ...',
    KeywordList: ['WFS', 'WMS', 'GEOSERVER'],
    OnlineResource: 'http://boundlessgeo.com/solutions/solutions-software/geoserver/',
    ContactInformation: {
      ContactPersonPrimary: {
        ContactPerson: 'Andreas Hocevar',
        ContactOrganization: 'ahocevar geospatial',
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
      ContactElectronicMailAddress: 'mail@ahocevar.com',
    },
    Fees: 'NONE',
    AccessConstraints: 'NONE',
  },
  Capability: {
    Exception: ['XML', 'INIMAGE', 'BLANK', 'JSON'],
    Request: {
      GetCapabilities: {
        Format: ['text/xml'],
        DCPType: [
          {
            HTTP: {
              Get: {
                OnlineResource: 'https://ahocevar.com/geoserver/ows?SERVICE=WMS&',
              },
              Post: {
                OnlineResource: 'https://ahocevar.com/geoserver/ows?SERVICE=WMS&',
              },
            },
          },
        ],
      },
      GetMap: {
        Format: ['image/png', 'application/atom+xml', 'application/json;type=geojson'],
        DCPType: [
          {
            HTTP: {
              Get: {
                OnlineResource: 'https://ahocevar.com/geoserver/ows?SERVICE=WMS&',
              },
            },
          },
        ],
      },
      GetFeatureInfo: {
        Format: [
          'text/plain',
          'application/vnd.ogc.gml',
          'text/xml',
          'application/vnd.ogc.gml/3.1.1',
          'text/xml; subtype=gml/3.1.1',
          'text/html',
          'application/json',
        ],
        DCPType: [
          {
            HTTP: {
              Get: {
                OnlineResource: 'https://ahocevar.com/geoserver/ows?SERVICE=WMS&',
              },
            },
          },
        ],
      },
    },
    Layer: {
      Title: 'GeoServer Web Map Service',
      Abstract: 'Web Map Service for map access implementing WMS 1.1.1 and WMS 1.3.0. Dyna...',
      CRS: ['AUTO:42001', 'AUTO:42002', 'AUTO:42003', 'AUTO:42004', 'AUTO:97001'],
      EX_GeographicBoundingBox: [-180, -90.000000000036, 180.00000000007202, 90.00000000000001],
      Layer: [
        {
          Title: 'GeoServer Web Map Service',
          Abstract: 'Web Map Service for map access implementing WMS 1.1.1 and WMS 1.3.0. Dynamic styling provided by the....',
          CRS: ['EPSG:2002', 'EPSG:2003', 'EPSG:2004', 'EPSG:2005', 'EPSG:42304', 'EPSG:42303', 'EPSG:404000', 'CRS:84'],
          EX_GeographicBoundingBox: [-180, -90.000000000036, 180.00000000007202, 90.00000000000001],
          BoundingBox: [
            {
              crs: 'CRS:84',
              extent: [-180, -90.000000000036, 180.00000000007202, 90.00000000000001],
              res: [null, null],
            },
          ],
        },
        {
          Name: 'ne:ne',
          Title: 'Natural Earth Base Map',
          Abstract: 'Layer-Group type layer: ne:ne',
          KeywordList: [],
          CRS: ['EPSG:2003', 'EPSG:2004', 'EPSG:2005', 'EPSG:2006', 'EPSG:100002', 'EPSG:42105', 'EPSG:100001', 'EPSG:42309', 'EPSG:42104'],
          EX_GeographicBoundingBox: [-179.9999999999999, -89.99999999999994, 180.00000000000014, 83.63410065300015],
          BoundingBox: [
            {
              crs: 'CRS:84',
              extent: [-179.9999999999999, -89.99999999999994, 180.00000000000014, 83.63410065300015],
              res: [null, null],
            },
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
});

export const SampleWmtsCapabilities = (): WmtsCapabilities => ({
  version: '1.0.0',
  ServiceIdentification: {
    Title: 'Service de visualisation WMTS Geoportail Publics',
    Abstract: "Ce service permet la visualisation de couches de données raster IGN au travers d'un flux WMTS",
    ServiceType: 'OGC WMTS',
    ServiceTypeVersion: '1.0.0',
    Fees: 'licences',
    AccessConstraints: "Conditions Générales d'Utilisation disponibles ici : http://professionnels.ign....",
  },
  ServiceProvider: {
    ProviderName: 'IGN',
    ProviderSite: '',
    ServiceContact: {
      IndividualName: 'Géoportail SAV',
      PositionName: 'custodian',
      ContactInfo: {
        Phone: {
          Voice: '',
          Facsimile: '',
        },
        Address: {
          DeliveryPoint: '73 avenue de Paris',
          City: 'Saint Mandé',
          AdministrativeArea: '',
          PostalCode: '94160',
          Country: 'France',
          ElectronicMailAddress: 'geop_services@geoportail.fr',
        },
      },
    },
  },
  OperationsMetadata: {
    GetCapabilities: {
      DCP: {
        HTTP: {
          Get: [
            {
              href: 'https://wxs.ign.fr/0666d69045a3e461-lol/geoportail/wmts?',
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
    GetTile: {
      DCP: {
        HTTP: {
          Get: [
            {
              href: 'https://wxs.ign.fr/0666d69045a3e461-lol/geoportail/wmts?',
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
              href: 'https://wxs.ign.fr/0666d69045a3e461-lol/geoportail/wmts?',
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
  Contents: {
    Layer: [
      {
        Title: 'Cartes IGN',
        Abstract: 'Cartes IGN',
        WGS84BoundingBox: [-180, -75, 180, 80],
        Identifier: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
        Style: [
          {
            Title: 'Légende générique',
            Identifier: 'normal',
            LegendURL: [
              {
                format: 'image/jpeg',
                href: 'https://wxs.ign.fr/static/legends/LEGEND.jpg',
              },
            ],
            isDefault: true,
          },
        ],
        Format: ['image/jpeg'],
        TileMatrixSetLink: [
          {
            TileMatrixSet: 'PM',
            TileMatrixSetLimits: [
              {
                TileMatrix: '0',
                MinTileRow: 0,
                MaxTileRow: 0,
                MinTileCol: 0,
                MaxTileCol: 1,
              },
              {
                TileMatrix: '1',
                MinTileRow: 0,
                MaxTileRow: 1,
                MinTileCol: 0,
                MaxTileCol: 2,
              },
              {
                TileMatrix: '2',
                MinTileRow: 0,
                MaxTileRow: 2,
                MinTileCol: 0,
                MaxTileCol: 4,
              },
              {
                TileMatrix: '3',
                MinTileRow: 0,
                MaxTileRow: 5,
                MinTileCol: 0,
                MaxTileCol: 8,
              },
              {
                TileMatrix: '4',
                MinTileRow: 1,
                MaxTileRow: 11,
                MinTileCol: 0,
                MaxTileCol: 16,
              },
              {
                TileMatrix: '5',
                MinTileRow: 3,
                MaxTileRow: 22,
                MinTileCol: 0,
                MaxTileCol: 32,
              },
              {
                TileMatrix: '6',
                MinTileRow: 7,
                MaxTileRow: 45,
                MinTileCol: 0,
                MaxTileCol: 64,
              },
              {
                TileMatrix: '7',
                MinTileRow: 32,
                MaxTileRow: 111,
                MinTileCol: 0,
                MaxTileCol: 127,
              },
              {
                TileMatrix: '8',
                MinTileRow: 80,
                MaxTileRow: 207,
                MinTileCol: 0,
                MaxTileCol: 255,
              },
              {
                TileMatrix: '9',
                MinTileRow: 160,
                MaxTileRow: 399,
                MinTileCol: 0,
                MaxTileCol: 495,
              },
              {
                TileMatrix: '10',
                MinTileRow: 336,
                MaxTileRow: 783,
                MinTileCol: 0,
                MaxTileCol: 991,
              },
              {
                TileMatrix: '11',
                MinTileRow: 672,
                MaxTileRow: 1551,
                MinTileCol: 0,
                MaxTileCol: 1983,
              },
              {
                TileMatrix: '12',
                MinTileRow: 1360,
                MaxTileRow: 3103,
                MinTileCol: 16,
                MaxTileCol: 3967,
              },
              {
                TileMatrix: '13',
                MinTileRow: 2720,
                MaxTileRow: 6191,
                MinTileCol: 32,
                MaxTileCol: 7935,
              },
              {
                TileMatrix: '14',
                MinTileRow: 5440,
                MaxTileRow: 12367,
                MinTileCol: 80,
                MaxTileCol: 15855,
              },
              {
                TileMatrix: '15',
                MinTileRow: 10944,
                MaxTileRow: 21183,
                MinTileCol: 160,
                MaxTileCol: 31711,
              },
              {
                TileMatrix: '16',
                MinTileRow: 21888,
                MaxTileRow: 42367,
                MinTileCol: 320,
                MaxTileCol: 63391,
              },
              {
                TileMatrix: '17',
                MinTileRow: 0,
                MaxTileRow: 131072,
                MinTileCol: 0,
                MaxTileCol: 131072,
              },
              {
                TileMatrix: '18',
                MinTileRow: 87557,
                MaxTileRow: 147052,
                MinTileCol: 85058,
                MaxTileCol: 171738,
              },
            ],
          },
        ],
      },
      {
        Title: 'carte OACI-VFR 2021',
        Abstract: "Les cartes OACI (Organisation de l'aviation civile internationale) ont été conçues pour le ...",
        WGS84BoundingBox: [-5.99644, 40.3893, 11.146, 51.4441],
        Identifier: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI',
        Style: [
          {
            Title: 'Légende générique',
            Identifier: 'normal',
            LegendURL: [
              {
                format: 'image/jpeg',
                href: 'https://wxs.ign.fr/static/legends/LEGEND.jpg',
              },
            ],
            isDefault: true,
          },
        ],
        Format: ['image/jpeg'],
        TileMatrixSetLink: [
          {
            TileMatrixSet: 'PM',
            TileMatrixSetLimits: [
              {
                TileMatrix: '6',
                MinTileRow: 21,
                MaxTileRow: 24,
                MinTileCol: 30,
                MaxTileCol: 34,
              },
              {
                TileMatrix: '7',
                MinTileRow: 42,
                MaxTileRow: 48,
                MinTileCol: 61,
                MaxTileCol: 68,
              },
              {
                TileMatrix: '8',
                MinTileRow: 85,
                MaxTileRow: 96,
                MinTileCol: 123,
                MaxTileCol: 136,
              },
              {
                TileMatrix: '9',
                MinTileRow: 170,
                MaxTileRow: 193,
                MinTileCol: 247,
                MaxTileCol: 272,
              },
              {
                TileMatrix: '10',
                MinTileRow: 340,
                MaxTileRow: 386,
                MinTileCol: 494,
                MaxTileCol: 544,
              },
              {
                TileMatrix: '11',
                MinTileRow: 681,
                MaxTileRow: 772,
                MinTileCol: 989,
                MaxTileCol: 1088,
              },
            ],
          },
        ],
      },
    ],
    TileMatrixSet: [
      {
        Identifier: 'PM',
        SupportedCRS: 'EPSG:3857',
        TileMatrix: [
          {
            Identifier: '0',
            ScaleDenominator: 559082264.0287179,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 1,
            MatrixHeight: 1,
          },
          {
            Identifier: '1',
            ScaleDenominator: 279541132.0143589,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 2,
            MatrixHeight: 2,
          },
          {
            Identifier: '2',
            ScaleDenominator: 139770566.0071794,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 4,
            MatrixHeight: 4,
          },
          {
            Identifier: '3',
            ScaleDenominator: 69885283.00358972,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 8,
            MatrixHeight: 8,
          },
          {
            Identifier: '4',
            ScaleDenominator: 34942641.50179486,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 16,
            MatrixHeight: 16,
          },
          {
            Identifier: '5',
            ScaleDenominator: 17471320.75089743,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 32,
            MatrixHeight: 32,
          },
          {
            Identifier: '6',
            ScaleDenominator: 8735660.375448715,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 64,
            MatrixHeight: 64,
          },
          {
            Identifier: '7',
            ScaleDenominator: 4367830.1877243575,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 128,
            MatrixHeight: 128,
          },
          {
            Identifier: '8',
            ScaleDenominator: 2183915.0938621787,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 256,
            MatrixHeight: 256,
          },
          {
            Identifier: '9',
            ScaleDenominator: 1091957.5469310887,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 512,
            MatrixHeight: 512,
          },
          {
            Identifier: '10',
            ScaleDenominator: 545978.7734655447,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 1024,
            MatrixHeight: 1024,
          },
          {
            Identifier: '11',
            ScaleDenominator: 272989.3867327723,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 2048,
            MatrixHeight: 2048,
          },
          {
            Identifier: '12',
            ScaleDenominator: 136494.69336638617,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 4096,
            MatrixHeight: 4096,
          },
          {
            Identifier: '13',
            ScaleDenominator: 68247.34668319307,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 8192,
            MatrixHeight: 8192,
          },
          {
            Identifier: '14',
            ScaleDenominator: 34123.67334159654,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 16384,
            MatrixHeight: 16384,
          },
          {
            Identifier: '15',
            ScaleDenominator: 17061.83667079827,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 32768,
            MatrixHeight: 32768,
          },
          {
            Identifier: '16',
            ScaleDenominator: 8530.918335399136,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 65536,
            MatrixHeight: 65536,
          },
          {
            Identifier: '17',
            ScaleDenominator: 4265.459167699568,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 131072,
            MatrixHeight: 131072,
          },
          {
            Identifier: '18',
            ScaleDenominator: 2132.729583849784,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 262144,
            MatrixHeight: 262144,
          },
          {
            Identifier: '19',
            ScaleDenominator: 1066.3647919248917,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 524288,
            MatrixHeight: 524288,
          },
          {
            Identifier: '20',
            ScaleDenominator: 533.1823959624461,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 1048576,
            MatrixHeight: 1048576,
          },
          {
            Identifier: '21',
            ScaleDenominator: 266.5911979812229,
            TopLeftCorner: [-20037508.342789248, 20037508.342789248],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 2097152,
            MatrixHeight: 2097152,
          },
        ],
      },
      {
        Identifier: 'WGS84G',
        SupportedCRS: 'IGNF:WGS84G',
        TileMatrix: [
          {
            Identifier: '0',
            ScaleDenominator: 279541132.0143589,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 2,
            MatrixHeight: 1,
          },
          {
            Identifier: '1',
            ScaleDenominator: 139770566.00717944,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 4,
            MatrixHeight: 2,
          },
          {
            Identifier: '2',
            ScaleDenominator: 69885283.00358972,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 8,
            MatrixHeight: 4,
          },
          {
            Identifier: '3',
            ScaleDenominator: 34942641.50179486,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 16,
            MatrixHeight: 8,
          },
          {
            Identifier: '4',
            ScaleDenominator: 17471320.75089743,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 32,
            MatrixHeight: 16,
          },
          {
            Identifier: '5',
            ScaleDenominator: 8735660.375448715,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 64,
            MatrixHeight: 32,
          },
          {
            Identifier: '6',
            ScaleDenominator: 4367830.1877243575,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 128,
            MatrixHeight: 64,
          },
          {
            Identifier: '7',
            ScaleDenominator: 2183915.0938621787,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 256,
            MatrixHeight: 128,
          },
          {
            Identifier: '8',
            ScaleDenominator: 1091957.5469310894,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 512,
            MatrixHeight: 256,
          },
          {
            Identifier: '9',
            ScaleDenominator: 545978.7734655447,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 1024,
            MatrixHeight: 512,
          },
          {
            Identifier: '10',
            ScaleDenominator: 272989.38673277234,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 2048,
            MatrixHeight: 1024,
          },
          {
            Identifier: '11',
            ScaleDenominator: 136494.69336638617,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 4096,
            MatrixHeight: 2048,
          },
          {
            Identifier: '12',
            ScaleDenominator: 68247.34668319309,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 8192,
            MatrixHeight: 4096,
          },
          {
            Identifier: '13',
            ScaleDenominator: 34123.67334159654,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 16384,
            MatrixHeight: 8192,
          },
          {
            Identifier: '14',
            ScaleDenominator: 17061.83667079827,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 32768,
            MatrixHeight: 16384,
          },
          {
            Identifier: '15',
            ScaleDenominator: 8530.918335399136,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 65536,
            MatrixHeight: 32768,
          },
          {
            Identifier: '16',
            ScaleDenominator: 4265.459167699568,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 131072,
            MatrixHeight: 65536,
          },
          {
            Identifier: '17',
            ScaleDenominator: 2132.729583849784,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 262144,
            MatrixHeight: 131072,
          },
          {
            Identifier: '18',
            ScaleDenominator: 1066.364791924892,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 524288,
            MatrixHeight: 262144,
          },
          {
            Identifier: '19',
            ScaleDenominator: 533.182395962446,
            TopLeftCorner: [-180, 90],
            TileWidth: 256,
            TileHeight: 256,
            MatrixWidth: 1048576,
            MatrixHeight: 524288,
          },
        ],
      },
    ],
  },
});
