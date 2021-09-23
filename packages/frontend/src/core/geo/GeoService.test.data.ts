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

/* eslint-disable max-len */

export const SampleWmsCapabilities = `
<?xml version='1.0' encoding="UTF-8" standalone="no" ?>
<?xml version='1.0' encoding="UTF-8"?>
<WMS_Capabilities version="1.3.0" xmlns="http://www.opengis.net/wms"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wms http://schemas.opengis.net/wms/1.3.0/capabilities_1_3_0.xsd">
<Service>
  <Name>WMS</Name>
  <Title>Acme Corp. Map Server</Title>
  <Abstract>Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.</Abstract>

  <KeywordList>
    <Keyword>bird</Keyword>
    <Keyword>roadrunner</Keyword>
    <Keyword>ambush</Keyword>
  </KeywordList>
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
   xlink:href="http://hostname/" />


  <ContactInformation>
    <ContactPersonPrimary>
      <ContactPerson>Jeff Smith</ContactPerson>
      <ContactOrganization>NASA</ContactOrganization>
    </ContactPersonPrimary>
    <ContactPosition>Computer Scientist</ContactPosition>

    <ContactAddress>
      <AddressType>postal</AddressType>
      <Address>NASA Goddard Space Flight Center</Address>
      <City>Greenbelt</City>
      <StateOrProvince>MD</StateOrProvince>
      <PostCode>20771</PostCode>

      <Country>USA</Country>
    </ContactAddress>
    <ContactVoiceTelephone>+1 301 555-1212</ContactVoiceTelephone>
    <ContactElectronicMailAddress>user@host.com</ContactElectronicMailAddress>
  </ContactInformation>

  <Fees>none</Fees>

  <AccessConstraints>none</AccessConstraints>
  <LayerLimit>16</LayerLimit>
  <MaxWidth>2048</MaxWidth>
  <MaxHeight>2048</MaxHeight>
</Service>
<Capability>
  <Request>
    <GetCapabilities>

      <Format>text/xml</Format>
      <DCPType>
        <HTTP>
          <Get>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
             xlink:type="simple"
             xlink:href="http://hostname/path?" />
          </Get>
          <Post>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
             xlink:type="simple"
             xlink:href="http://hostname/path?" />

          </Post>
        </HTTP>
      </DCPType>
    </GetCapabilities>
    <GetMap>
      <Format>image/gif</Format>
      <Format>image/png</Format>
      <Format>image/jpeg</Format>

      <DCPType>
        <HTTP>
          <Get>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
             xlink:type="simple"
             xlink:href="http://hostname/path?" />
          </Get>
        </HTTP>
      </DCPType>
    </GetMap>

    <GetFeatureInfo>
      <Format>text/xml</Format>
      <Format>text/plain</Format>
      <Format>text/html</Format>
      <DCPType>
        <HTTP>
          <Get>

            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
             xlink:type="simple"
             xlink:href="http://hostname/path?" />
          </Get>
        </HTTP>
      </DCPType>
    </GetFeatureInfo>
  </Request>
  <Exception>
    <Format>XML</Format>

    <Format>INIMAGE</Format>
    <Format>BLANK</Format>
  </Exception>
  <Layer>
    <Title>Acme Corp. Map Server</Title>
    <CRS>CRS:84</CRS>

    <AuthorityURL name="DIF_ID">
      <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
       xlink:href="http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html" />
    </AuthorityURL>
    <BoundingBox CRS="CRS:84"
     minx="-1" miny="-1" maxx="1" maxy="1" resx="0.0" resy="0.0"/>
    <Layer>

      <Name>ROADS_RIVERS</Name>
      <Title>Roads and Rivers</Title>

      <CRS>EPSG:26986</CRS>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-71.63</westBoundLongitude>
        <eastBoundLongitude>-70.78</eastBoundLongitude>
        <southBoundLatitude>41.75</southBoundLatitude>
        <northBoundLatitude>42.90</northBoundLatitude>

      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84"
       minx="-71.63" miny="41.75" maxx="-70.78" maxy="42.90" resx="0.01" resy="0.01"/>
      <BoundingBox CRS="EPSG:26986"
       minx="189000" miny="834000" maxx="285000" maxy="962000" resx="1" resy="1" />
      <Attribution>
        <Title>State College University</Title>
        <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
         xlink:href="http://www.university.edu/" />

        <LogoURL width="100" height="100">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
           xlink:type="simple"
           xlink:href="http://www.university.edu/icons/logo.gif" />
        </LogoURL>
      </Attribution>
      <Identifier authority="DIF_ID">123456</Identifier>
      <FeatureListURL>

        <Format>XML</Format>
        <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
         xlink:href="http://www.university.edu/data/roads_rivers.gml" />
      </FeatureListURL>
      <Style>
        <Name>USGS</Name>
        <Title>USGS Topo Map Style</Title>
        <Abstract>Features are shown in a style like that used in USGS topographic maps.</Abstract>

        <LegendURL width="72" height="72">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
           xlink:type="simple"
           xlink:href="http://www.university.edu/legends/usgs.gif" />
        </LegendURL>
        <StyleSheetURL>
          <Format>text/xsl</Format>

          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
           xlink:type="simple"
           xlink:href="http://www.university.edu/stylesheets/usgs.xsl" />
        </StyleSheetURL>
      </Style>
      <MinScaleDenominator>1000</MinScaleDenominator>
      <MaxScaleDenominator>250000</MaxScaleDenominator>
      <Layer queryable="1">
        <Name>ROADS_1M</Name>
        <Title>Roads at 1:1M scale</Title>
        <Abstract>Roads at a scale of 1 to 1 million.</Abstract>

        <KeywordList>
          <Keyword>road</Keyword>
          <Keyword>transportation</Keyword>
          <Keyword>atlas</Keyword>
        </KeywordList>
        <Identifier authority="DIF_ID">123456</Identifier>
        <MetadataURL type="FGDC:1998">

                <Format>text/plain</Format>
                <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
                 xlink:type="simple"
                 xlink:href="http://www.university.edu/metadata/roads.txt" />
             </MetadataURL>
        <MetadataURL type="ISO19115:2003">
               <Format>text/xml</Format>
               <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:type="simple"
                xlink:href="http://www.university.edu/metadata/roads.xml" />
             </MetadataURL>

        <Style>
          <Name>ATLAS</Name>
          <Title>Road atlas style</Title>
          <Abstract>Roads are shown in a style like that used in a commercial road atlas.</Abstract>
        <LegendURL width="72" height="72">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink"
           xlink:type="simple"
           xlink:href="http://www.university.edu/legends/atlas.gif" />

        </LegendURL>
        </Style>
      </Layer>
      <Layer queryable="1">
        <Name>RIVERS_1M</Name>
        <Title>Rivers at 1:1M scale</Title>
        <Abstract>Rivers at a scale of 1 to 1 million.</Abstract>

        <KeywordList>
          <Keyword>river</Keyword>
          <Keyword>canal</Keyword>
          <Keyword>waterway</Keyword>
        </KeywordList>
      </Layer>
    </Layer>

    <Layer queryable="1">
      <Title>Weather Forecast Data</Title>
      <CRS>CRS:84</CRS>

      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>

        <southBoundLatitude>-90</southBoundLatitude>
        <northBoundLatitude>90</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <Dimension name="time" units="ISO8601" default="2000-08-22">1999-01-01/2000-08-22/P1D</Dimension>
      <Layer>

        <Name>Clouds</Name>
        <Title>Forecast cloud cover</Title>
      </Layer>
      <Layer>
        <Name>Temperature</Name>
        <Title>Forecast temperature</Title>
      </Layer>

      <Layer>
        <Name>Pressure</Name>
        <Title>Forecast barometric pressure</Title>
         <Dimension name="elevation" units="EPSG:5030" />
         <Dimension name="time" units="ISO8601" default="2000-08-22">
           1999-01-01/2000-08-22/P1D</Dimension>

         <Dimension name="elevation" units="CRS:88" default="0" nearestValue="1">0,1000,3000,5000,10000</Dimension>
      </Layer>
    </Layer>
    <Layer opaque="1" noSubsets="1" fixedWidth="512" fixedHeight="256">
      <Name>ozone_image</Name>
      <Title>Global ozone distribution (1992)</Title>

      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-90</southBoundLatitude>
        <northBoundLatitude>90</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <Dimension name="time" units="ISO8601" default="1992">1992</Dimension>

    </Layer>
    <Layer cascaded="1">
      <Name>population</Name>
      <Title>World population, annual</Title>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>

        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-90</southBoundLatitude>
        <northBoundLatitude>90</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <Dimension name="time" units="ISO8601" default="2000">1990/2000/P1Y</Dimension>
    </Layer>
  </Layer>

</Capability>
</WMS_Capabilities>
`;

export const SampleWmtsCapabilities = `
<?xml version="1.0" encoding="UTF-8"?>
<Capabilities version="1.0.0" xmlns="http://www.opengis.net/wmts/1.0" xmlns:gml="http://www.opengis.net/gml" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd">
    <ows:ServiceIdentification>
        <ows:Title>Koordinates Labs</ows:Title>
        <ows:ServiceType>OGC WMTS</ows:ServiceType>
        <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
    </ows:ServiceIdentification>
    <ows:ServiceProvider>
        <ows:ProviderName>Koordinates</ows:ProviderName>
        <ows:ProviderSite xlink:href="http://labs.koordinates.com"/>
        <ows:ServiceContact/>
    </ows:ServiceProvider>
    <ows:OperationsMetadata>
        <ows:Operation name="GetCapabilities">
            <ows:DCP>
                <ows:HTTP>
                    <ows:Get xlink:href="https://labs.koordinates.com/services;key=d740ea02e0c44cafb70dce31a774ca10/wmts/1.0.0/layer/7328/WMTSCapabilities.xml?">
                        <ows:Constraint name="GetEncoding">
                            <ows:AllowedValues>
                                <ows:Value>KVP</ows:Value>
                            </ows:AllowedValues>
                        </ows:Constraint>
                    </ows:Get>
                </ows:HTTP>
            </ows:DCP>
        </ows:Operation>
        <ows:Operation name="GetFeatureInfo">
            <ows:DCP>
                <ows:HTTP>
                    <ows:Get xlink:href="https://labs.koordinates.com/services;key=d740ea02e0c44cafb70dce31a774ca10/wmts/?">
                        <ows:Constraint name="GetEncoding">
                            <ows:AllowedValues>
                                <ows:Value>KVP</ows:Value>
                            </ows:AllowedValues>
                        </ows:Constraint>
                    </ows:Get>
                </ows:HTTP>
            </ows:DCP>
        </ows:Operation>
    </ows:OperationsMetadata>
    <Contents>
        <Layer>
            <ows:Title>New Zealand Earthquakes</ows:Title>
            <ows:Abstract>Historical earthquake data, accessed via the [GeoNet WFS feed](http://info.geonet.org.nz/display/appdata/Advanced+Queries). The data has been filtered to only include quakes in proximity to New Zealand with an \`eventtype\` of &quot;Earthquake&quot; or &quot;none&quot; per the [GeoNet catalogue](http://info.geonet.org.nz/display/appdata/Catalogue+Output). Most fields have been removed. Please also note the excluded data per this [GeoNet page](http://info.geonet.org.nz/display/appdata/The+Gap). We acknowledge the New Zealand GeoNet project and its sponsors EQC, GNS Science and LINZ, for providing data used in this layer.</ows:Abstract>
            <ows:Identifier>layer-7328</ows:Identifier>
            <ows:BoundingBox crs="urn:ogc:def:crs:EPSG::3857">
                <ows:LowerCorner>-20037508.342789 -6406581.708337</ows:LowerCorner>
                <ows:UpperCorner>20037508.342789 -3653545.667928</ows:UpperCorner>
            </ows:BoundingBox>
            <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
                <ows:LowerCorner>-180.000000 -49.454297</ows:LowerCorner>
                <ows:UpperCorner>180.000000 -31.160000</ows:UpperCorner>
            </ows:WGS84BoundingBox>
            <Style isDefault="true">
                <ows:Title>Weighted point styles</ows:Title>
                <ows:Identifier>style=39</ows:Identifier>
            </Style>
            <Format>image/png</Format>
            <InfoFormat>application/json</InfoFormat>
            <InfoFormat>text/html</InfoFormat>
            <TileMatrixSetLink>
                <TileMatrixSet>EPSG:3857</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/png" resourceType="tile" template="https://koordinates-tiles-a.global.ssl.fastly.net/services;key=d740ea02e0c44cafb70dce31a774ca10/tiles/v4/layer=7328,{style}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png"/>
            <ResourceURL format="application/json" resourceType="FeatureInfo" template="https://labs.koordinates.com/services;key=d740ea02e0c44cafb70dce31a774ca10/wmts/1.0.0/layer/7328/featureinfo/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}/{I}/{J}.json"/>
            <ResourceURL format="text/html" resourceType="FeatureInfo" template="https://labs.koordinates.com/services;key=d740ea02e0c44cafb70dce31a774ca10/wmts/1.0.0/layer/7328/featureinfo/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}/{I}/{J}.html"/>
        </Layer>
        <TileMatrixSet>
            <ows:Title>GoogleMapsCompatible</ows:Title>
            <ows:Abstract>The well-known 'GoogleMapsCompatible' tile matrix set defined by the OGC WMTS specification</ows:Abstract>
            <ows:Identifier>EPSG:3857</ows:Identifier>
            <ows:BoundingBox crs="urn:ogc:def:crs:EPSG::3857">
                <ows:LowerCorner>-20037508.342789 -20037508.342789</ows:LowerCorner>
                <ows:UpperCorner>20037508.342789 20037508.342789</ows:UpperCorner>
            </ows:BoundingBox>
            <ows:SupportedCRS>urn:ogc:def:crs:EPSG::3857</ows:SupportedCRS>
            <WellKnownScaleSet>urn:ogc:def:wkss:OGC:1.0:GoogleMapsCompatible</WellKnownScaleSet>
            <TileMatrix>
                <ows:Identifier>0</ows:Identifier>
                <ScaleDenominator>559082264.029</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>1</ows:Identifier>
                <ScaleDenominator>279541132.014</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>2</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>2</ows:Identifier>
                <ScaleDenominator>139770566.007</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>4</MatrixWidth>
                <MatrixHeight>4</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>3</ows:Identifier>
                <ScaleDenominator>69885283.0036</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>8</MatrixWidth>
                <MatrixHeight>8</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>4</ows:Identifier>
                <ScaleDenominator>34942641.5018</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>16</MatrixWidth>
                <MatrixHeight>16</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>5</ows:Identifier>
                <ScaleDenominator>17471320.7509</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>32</MatrixWidth>
                <MatrixHeight>32</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>6</ows:Identifier>
                <ScaleDenominator>8735660.37545</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>64</MatrixWidth>
                <MatrixHeight>64</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>7</ows:Identifier>
                <ScaleDenominator>4367830.18772</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>128</MatrixWidth>
                <MatrixHeight>128</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>8</ows:Identifier>
                <ScaleDenominator>2183915.09386</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>256</MatrixWidth>
                <MatrixHeight>256</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>9</ows:Identifier>
                <ScaleDenominator>1091957.54693</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>512</MatrixWidth>
                <MatrixHeight>512</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>10</ows:Identifier>
                <ScaleDenominator>545978.773466</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>1024</MatrixWidth>
                <MatrixHeight>1024</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>11</ows:Identifier>
                <ScaleDenominator>272989.386733</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>2048</MatrixWidth>
                <MatrixHeight>2048</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>12</ows:Identifier>
                <ScaleDenominator>136494.693366</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>4096</MatrixWidth>
                <MatrixHeight>4096</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>13</ows:Identifier>
                <ScaleDenominator>68247.3466832</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>8192</MatrixWidth>
                <MatrixHeight>8192</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>14</ows:Identifier>
                <ScaleDenominator>34123.6733416</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>16384</MatrixWidth>
                <MatrixHeight>16384</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>15</ows:Identifier>
                <ScaleDenominator>17061.8366708</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>32768</MatrixWidth>
                <MatrixHeight>32768</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>16</ows:Identifier>
                <ScaleDenominator>8530.9183354</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>65536</MatrixWidth>
                <MatrixHeight>65536</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>17</ows:Identifier>
                <ScaleDenominator>4265.4591677</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>131072</MatrixWidth>
                <MatrixHeight>131072</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>18</ows:Identifier>
                <ScaleDenominator>2132.72958385</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>262144</MatrixWidth>
                <MatrixHeight>262144</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>19</ows:Identifier>
                <ScaleDenominator>1066.36479192</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>524288</MatrixWidth>
                <MatrixHeight>524288</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>20</ows:Identifier>
                <ScaleDenominator>533.182395962</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>1048576</MatrixWidth>
                <MatrixHeight>1048576</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>21</ows:Identifier>
                <ScaleDenominator>266.591197981</ScaleDenominator>
                <TopLeftCorner>-20037508.3428 20037508.3428</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>2097152</MatrixWidth>
                <MatrixHeight>2097152</MatrixHeight>
            </TileMatrix>
        </TileMatrixSet>
    </Contents>
    <ServiceMetadataURL xlink:href="https://labs.koordinates.com/services;key=d740ea02e0c44cafb70dce31a774ca10/wmts/1.0.0/layer/7328/WMTSCapabilities.xml"/>
</Capabilities>
`;
