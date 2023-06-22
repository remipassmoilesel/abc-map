/**
 * Copyright © 2022 Rémi Pace.
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

import { abcRender } from '../../../core/utils/test/abcRender';
import { useCsv } from './useCsv';
import { useEffect, useMemo } from 'react';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { FileIO, FilesSelected, InputResultType } from '../../../core/utils/FileIO';
import { TestHelper } from '../../../core/utils/test/TestHelper';
import { CsvParser } from '../../../core/data/csv-parser/CsvParser';
import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { act } from '@testing-library/react';
import { errorMessage } from '@abc-map/shared';

jest.mock('../../../core/utils/FileIO');

describe('useCsv', () => {
  const sampleLayer = () => {
    const layer = LayerFactory.newVectorLayer();
    layer
      .getSource()
      .addFeatures([
        FeatureWrapper.create().setId('ysZrLxikgJ').setProperties({ name: 'Montpellier', id: 11 }).unwrap(),
        FeatureWrapper.create().setId('FkgKCaSCFx').setProperties({ name: 'Cherbourg', id: 22 }).unwrap(),
        FeatureWrapper.create().setId('X_-J5_VShM').setProperties({ name: 'Grenoble', id: 33 }).unwrap(),
        FeatureWrapper.create().setId('-_HQZ2Mzmj').setProperties({ name: 'Toulon', id: 44 }).unwrap(),
      ]);
    return layer;
  };

  const sampleLayerRows = (layer: VectorLayerWrapper) =>
    layer
      .getSource()
      .getFeatures()
      .map((feat) => FeatureWrapper.from(feat).toDataRow());

  it('exportFile()', async () => {
    // Prepare
    function TestComponent() {
      const layer = useMemo(() => sampleLayer(), []);
      const rows = useMemo(() => sampleLayerRows(layer), [layer]);

      const { exportFile, result } = useCsv(layer, rows);
      useEffect(() => exportFile(), [exportFile]);

      return <>{JSON.stringify({ result })}</>;
    }

    // Act
    const { container } = abcRender(<TestComponent />);
    await TestHelper.wait(10); // We wait for an internal promise

    // Assert
    expect(container).toMatchSnapshot();
    expect(FileIO.downloadBlob).toBeCalledTimes(1);

    const file = (FileIO.downloadBlob as jest.MockedFn<any>).mock.calls[0][0] as File;
    expect(file).toBeDefined();

    const rows = await CsvParser.parse(file);
    expect(rows).toMatchSnapshot();
  });

  it('importFile() should fail if content is invalid', async () => {
    // Prepare
    const prompt: FilesSelected = {
      type: InputResultType.Confirmed,
      files: [new Blob(['jsjsajsjasjajsajsjasjajs']) as File],
    };
    (FileIO.openPrompt as jest.MockedFn<any>).mockResolvedValue(prompt);

    function TestComponent() {
      const layer = useMemo(() => sampleLayer(), []);
      const rows = useMemo(() => sampleLayerRows(layer), [layer]);

      const { importFile, result } = useCsv(layer, rows);
      useEffect(() => importFile(), [importFile]);

      return <>{JSON.stringify({ result, error: errorMessage(result?.error) })}</>;
    }

    // Act
    const { container } = abcRender(<TestComponent />);
    await act(async () => {
      await TestHelper.wait(10); // We wait for an internal promise
    });

    // Assert
    expect(container).toMatchSnapshot();
  });

  it('importFile() should update layer', async () => {
    // Prepare
    const csvFile = await CsvParser.unparse(
      [
        {
          __id__: 'ysZrLxikgJ',
          name: 'Montpellier',
          id: '11',
        },
        {
          __id__: 'FkgKCaSCFx',
          name: 'Cherbourg',
          id: '22',
        },
        {
          __id__: 'X_-J5_VShM',
          name: 'Gre-gre-noble',
          id: '33',
        },
        // "Toulon" element will not be deleted because delete is not implemented.
        // This element will be skipped because we can not create a geometry for the moment.
        {
          __id__: 'C5VurN_4k_',
          name: 'Brest',
          id: '55',
        },
      ],
      'file.csv'
    );
    const prompt: FilesSelected = {
      type: InputResultType.Confirmed,
      files: [csvFile],
    };
    (FileIO.openPrompt as jest.MockedFn<any>).mockResolvedValue(prompt);

    const layer = sampleLayer();

    function TestComponent({ layer }: { layer: VectorLayerWrapper }) {
      const rows = useMemo(() => sampleLayerRows(layer), [layer]);

      const { importFile, result } = useCsv(layer, rows);
      useEffect(() => importFile(), [importFile]);

      return <>{JSON.stringify({ result })}</>;
    }

    // Act
    const { container } = abcRender(<TestComponent layer={layer} />);
    await act(async () => {
      await TestHelper.wait(10); // We wait for an internal promise
    });

    // Assert
    expect(container).toMatchSnapshot();

    const dataRows = layer
      .getSource()
      .getFeatures()
      .map((f) => FeatureWrapper.from(f).toDataRow());
    expect(dataRows).toMatchSnapshot();
  });
});
