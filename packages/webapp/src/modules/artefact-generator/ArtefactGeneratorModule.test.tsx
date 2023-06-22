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

import { ArtefactGeneratorModule } from './ArtefactGeneratorModule';
import { newTestServices, TestServices } from '../../core/utils/test/TestServices';
import { Services } from '../../core/Services';
import * as sinon from 'sinon';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import { PreviewExporter } from './PreviewExporter';
import { Parameters } from './typings';
import { AbcFile, BlobIO, Language, LayerType } from '@abc-map/shared';
import { wmsCapabilities, wmtsCapabilities } from './ArtefactGeneratorModule.test.data';

describe('ArtefactGeneratorModule', () => {
  const parameters: Parameters = {
    type: LayerType.Xyz,
    name: [
      { language: Language.French, text: 'Artefact name FR' },
      { language: Language.English, text: 'Artefact name EN' },
    ],
    provider: 'Nowhere inc',
    description: [
      { language: Language.French, text: 'Artefact description FR' },
      { language: Language.English, text: 'Artefact description EN' },
    ],
    license: 'Artefact license',
    attributions: 'Artefact attributions\n\n\n',
    keywords: [
      { language: Language.French, text: 'Keyword FR 1 ; Keyword FR 2 ; Keyword FR 3' },
      { language: Language.English, text: 'Keyword EN 1 ; Keyword EN 2 ; Keyword EN 3' },
    ],
    link: 'http://source',
    wms: {
      url: 'http://domain.com/wms/',
    },
    wmts: {
      url: 'http://domain.com/wmts/',
    },
    xyz: {
      url: 'http://domain.com/{x}/{y}/{z}/',
    },
    previews: {
      enabled: true,
      views: [
        { center: [255127.43458646, 5854183.083256814], resolution: 13000, projection: { name: 'EPSG:3857' }, rotation: 0 },
        { center: [255127.43458646, 5854183.083256814], resolution: 2500, projection: { name: 'EPSG:3857' }, rotation: 0 },
        { center: [-516837.321601631, 6144242.706693536], resolution: 125, projection: { name: 'EPSG:3857' }, rotation: 0 },
      ],
    },
    layerIndexes: {
      offset: -1,
      limit: -1,
    },
  };

  let services: TestServices;
  let previewExporter: SinonStubbedInstance<PreviewExporter>;
  let progressHandler: SinonStub;
  let generator: ArtefactGeneratorModule;

  beforeEach(() => {
    services = newTestServices();
    previewExporter = sinon.createStubInstance(PreviewExporter);
    progressHandler = sinon.stub();
    generator = new ArtefactGeneratorModule(services as unknown as Services, previewExporter);

    // Preview export does not work in jest environment
    previewExporter.exportPreviews.resolves([new Blob(), new Blob()]);
  });

  it('XYZ', async () => {
    // Act
    const files = await generator.xyzArtefact(parameters, progressHandler);

    // Assert
    // File list
    expect(files.map((f) => f.path)).toEqual(['definition.xyz', 'preview-0.png', 'preview-1.png', 'LICENSE.txt', 'artefact.yml']);

    // Layer definition
    expect(await fileAsString(files[0])).toEqual(
      `\
version: 0.0.1
xyz:
  url: http://domain.com/{x}/{y}/{z}/
`
    );

    // Previews (they are fake)
    expect(files[1].content).toEqual(new Blob());
    expect(files[2].content).toEqual(new Blob());

    // License
    expect(await fileAsString(files[3])).toEqual(`Artefact license`);

    // Artefact manifest
    expect(await fileAsString(files[4])).toEqual(`\
version: 0.0.1
artefact:
  name:
    - language: fr
      text: Artefact name FR
    - language: en
      text: Artefact name EN
  type: basemap
  description:
    - language: fr
      text: Artefact description FR
    - language: en
      text: Artefact description EN
  keywords:
    - language: fr
      text:
        - Keyword FR 1
        - Keyword FR 2
        - Keyword FR 3
    - language: en
      text:
        - Keyword EN 1
        - Keyword EN 2
        - Keyword EN 3
  provider: Nowhere inc
  link: http://source
  license: LICENSE.txt
  attributions:
    - Artefact attributions
  files:
    - definition.xyz
  previews:
    - preview-0.png
    - preview-1.png
`);
  });

  it('WMS', async () => {
    // Prepare
    services.geo.getWmsCapabilities.resolves(wmsCapabilities());

    // Act
    const files = await generator.wmsArtefacts(parameters, progressHandler);

    // Assert
    // File list
    expect(files.map((f) => f.path)).toEqual([
      'first-layer/preview-0.png',
      'first-layer/preview-1.png',
      'first-layer/LICENSE.txt',
      'first-layer/definition.wms',
      'first-layer/artefact.yml',
      'second-layer/preview-0.png',
      'second-layer/preview-1.png',
      'second-layer/LICENSE.txt',
      'second-layer/definition.wms',
      'second-layer/artefact.yml',
    ]);

    // Previews (they are fake)
    expect(files[0].content).toEqual(new Blob());
    expect(files[1].content).toEqual(new Blob());

    // License
    expect(await fileAsString(files[2])).toEqual(`Artefact license`);

    // Layer definition
    expect(await fileAsString(files[3])).toEqual(
      `\
version: 0.0.1
wms:
  urls:
    - http://localhost:3010/wms/public?SERVICE=WMS&
  remoteLayerName: first-layer
  projection:
    name: EPSG:4326
`
    );

    // Artefact manifest
    expect(await fileAsString(files[4])).toEqual(`\
version: 0.0.1
artefact:
  name:
    - language: fr
      text: Artefact name FR first-layer
    - language: en
      text: Artefact name EN first-layer
  type: basemap
  description:
    - language: fr
      text: 'Artefact description FR Layer-Group type layer: ne:ne'
    - language: en
      text: 'Artefact description EN Layer-Group type layer: ne:ne'
  keywords:
    - language: fr
      text:
        - Keyword FR 1
        - Keyword FR 2
        - Keyword FR 3
    - language: en
      text:
        - Keyword EN 1
        - Keyword EN 2
        - Keyword EN 3
  provider: Nowhere inc
  link: http://source
  license: LICENSE.txt
  attributions:
    - Artefact attributions
  files:
    - definition.wms
  previews:
    - preview-0.png
    - preview-1.png
`);
  });

  it('WMTS', async () => {
    // Prepare
    services.geo.getWmtsCapabilities.resolves(wmtsCapabilities());
    services.geo.getWmtsLayerOptions.resolves({ projection: 'EPSG:3857' } as any);

    // Act
    const files = await generator.wmtsArtefacts(parameters, progressHandler);

    // Assert
    // File list
    expect(files.map((f) => f.path)).toEqual([
      'layer-7328/preview-0.png',
      'layer-7328/preview-1.png',
      'layer-7328/LICENSE.txt',
      'layer-7328/definition.wmts',
      'layer-7328/artefact.yml',
      'layer-7329/preview-0.png',
      'layer-7329/preview-1.png',
      'layer-7329/LICENSE.txt',
      'layer-7329/definition.wmts',
      'layer-7329/artefact.yml',
    ]);

    // Previews (they are fake)
    expect(files[0].content).toEqual(new Blob());
    expect(files[1].content).toEqual(new Blob());

    // License
    expect(await fileAsString(files[2])).toEqual(`Artefact license`);

    // Layer definition
    expect(await fileAsString(files[3])).toEqual(
      `\
version: 0.0.1
wmts:
  capabilitiesUrl: http://domain.com/wmts/
  remoteLayerName: layer-7328
`
    );

    // Artefact manifest
    expect(await fileAsString(files[4])).toEqual(`\
version: 0.0.1
artefact:
  name:
    - language: fr
      text: Artefact name FR layer-7328
    - language: en
      text: Artefact name EN layer-7328
  type: basemap
  description:
    - language: fr
      text: >-
        Artefact description FR Historical earthquake data, accessed via the
        [GeoNet WFS
        feed](http://info.geonet.org.nz/display/appdata/Advanced+Queries). The
        data has...
    - language: en
      text: >-
        Artefact description EN Historical earthquake data, accessed via the
        [GeoNet WFS
        feed](http://info.geonet.org.nz/display/appdata/Advanced+Queries). The
        data has...
  keywords:
    - language: fr
      text:
        - Keyword FR 1
        - Keyword FR 2
        - Keyword FR 3
    - language: en
      text:
        - Keyword EN 1
        - Keyword EN 2
        - Keyword EN 3
  provider: Nowhere inc
  link: http://source
  license: LICENSE.txt
  attributions:
    - Artefact attributions
  files:
    - definition.wmts
  previews:
    - preview-0.png
    - preview-1.png
`);
  });
});

function fileAsString(f: AbcFile): Promise<string> {
  return BlobIO.asString(f.content as Blob);
}
