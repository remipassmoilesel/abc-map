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
import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { useNoobFormBuilder } from './useNoobFormBuilder';
import { MapWrapper } from '../map';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import { newTestLayerWrapper, newTestMapWrapper } from '../test';
import * as sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { wait } from '../test/wait';

describe('useNoobFormBuilder', () => {
  interface FormValues {
    // Checkbox group
    geometries: string[];
    // Layer selector
    layerId: string;
    // Select
    unit: string;
    // Text input
    name: string;
    // Date input
    startDate: string;
    // Number input
    size: number;
  }

  interface Props {
    map: MapWrapper;
    values?: FormValues;
    onChange: SinonStub;
    onSubmit: SinonStub;
    onErrors: SinonStub;
  }

  function TestForm(props: Props) {
    const { map, values, onChange, onSubmit, onErrors } = props;

    const builder = useNoobFormBuilder<FormValues>(values);
    builder.onSubmit(onSubmit);
    builder.onErrors(onErrors);

    useEffect(() => {
      const subscription = builder.onChange(onChange);
      return () => subscription.unsubscribe();
    }, [builder, onChange]);

    return (
      <div>
        {builder
          .addCheckboxes({ name: 'geometries', label: 'Geometries' }, [
            { label: 'Point', value: 'point' },
            { label: 'Line', value: 'line' },
            { label: 'Polygon', value: 'polygon' },
          ])
          .addLayerSelector({ name: 'layerId', label: 'Layer' }, map)
          .addSelect({ name: 'unit', label: 'Unit' }, [
            { label: 'Meters', value: 'meter' },
            { label: 'Kilometers', value: 'kilometers' },
          ])
          .addText({ name: 'name', label: 'Name' })
          .addDatePicker({ name: 'startDate', label: 'Start date' })
          .addNumber({ name: 'size', label: 'Size' }, { min: 0, max: 1000 })
          .setCommonLabels({ submitButton: 'Submit button', cancelButton: 'Cancel button' })
          .build()}
      </div>
    );
  }

  let map: SinonStubbedInstance<MapWrapper>;
  let onChange: SinonStub;
  let onSubmit: SinonStub;
  let onErrors: SinonStub;

  beforeEach(() => {
    map = newTestMapWrapper();
    onChange = sinon.stub();
    onSubmit = sinon.stub();
    onErrors = sinon.stub();

    // Fake map will return two layers
    const layer1 = newTestLayerWrapper();
    layer1.getId.returns('test-layer-1');
    layer1.getName.returns('Test layer 1');

    const layer2 = newTestLayerWrapper();
    layer2.getId.returns('test-layer-2');
    layer2.getName.returns('Test layer 2');

    map.getLayers.returns([layer1, layer2]);
  });

  it('should render without values', () => {
    const { container } = render(<TestForm map={map} onChange={onChange} onSubmit={onSubmit} onErrors={onErrors} />);

    expect(container).toMatchSnapshot();
  });

  it('should render without values', () => {
    const values: FormValues = {
      geometries: ['point'],
      layerId: 'test-layer-2',
      unit: 'meters',
      name: 'Test name',
      startDate: '2018-06-12T19:30',
      size: 99,
    };

    const { container } = render(<TestForm map={map} values={values} onChange={onChange} onSubmit={onSubmit} onErrors={onErrors} />);

    expect(container).toMatchSnapshot();
  });

  it('should trigger onChange then onSubmit', async () => {
    // Prepare
    const values: FormValues = {
      geometries: ['point'],
      layerId: 'test-layer-2',
      unit: 'meters',
      name: 'Test name',
      startDate: '2018-06-12T19:30',
      size: 99,
    };

    const { getByTestId } = render(<TestForm map={map} values={values} onChange={onChange} onSubmit={onSubmit} onErrors={onErrors} />);

    // Act
    // Checkboxes
    await userEvent.click(getByTestId('geometries-line'));
    await userEvent.click(getByTestId('geometries-polygon'));
    // Layer selector
    await userEvent.selectOptions(getByTestId('layerId'), 'Test layer 1');
    // Selector
    await userEvent.selectOptions(getByTestId('unit'), 'Kilometers');
    // Text input
    await userEvent.clear(getByTestId('name'));
    await userEvent.type(getByTestId('name'), 'New name');
    // Date input
    await userEvent.clear(getByTestId('startDate'));
    await userEvent.type(getByTestId('startDate'), '2022-06-12T19:30');
    // Number input
    await userEvent.clear(getByTestId('size'));
    await userEvent.type(getByTestId('size'), '88');
    // Submit
    await userEvent.click(getByTestId('submit-button'));

    // Assert
    // onChange
    expect(onChange.callCount).toEqual(20);
    expect(onChange.args[19]).toEqual([
      {
        geometries: ['point', 'line', 'polygon'],
        layerId: 'test-layer-1',
        name: 'New name',
        size: '88',
        startDate: '2022-06-12T19:30',
        unit: 'kilometers',
      },
    ]);

    // onSubmit
    expect(onSubmit.callCount).toEqual(1);
    expect(onSubmit.args[0][0]).toEqual({
      geometries: ['point', 'line', 'polygon'],
      layerId: 'test-layer-1',
      name: 'New name',
      size: '88',
      startDate: '2022-06-12T19:30',
      unit: 'kilometers',
    });
  });

  it('should trigger onError if any', async () => {
    // Prepare
    const values: FormValues = {
      geometries: ['point'],
      layerId: 'test-layer-2',
      unit: 'meters',
      name: 'Test name',
      startDate: '2018-06-12T19:30',
      size: 99,
    };

    onErrors.callsFake((errors) => {
      const messages: string[] = [];
      if (errors.size) {
        messages.push('Size must be between 0 and 1000');
      }
      return messages;
    });

    const { container, getByTestId } = render(<TestForm map={map} values={values} onChange={onChange} onSubmit={onSubmit} onErrors={onErrors} />);

    // Act
    await userEvent.clear(getByTestId('size'));
    await userEvent.type(getByTestId('size'), '2000');
    await userEvent.click(getByTestId('submit-button'));

    await wait(10);

    // Assert
    expect(onErrors.callCount).toEqual(1);
    expect(onSubmit.callCount).toEqual(0);
    expect(container).toMatchSnapshot();
  });
});
