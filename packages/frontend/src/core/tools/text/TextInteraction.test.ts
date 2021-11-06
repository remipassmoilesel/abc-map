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

import { TextInteraction } from './TextInteraction';
import VectorSource from 'ol/source/Vector';
import { Geometry, Point } from 'ol/geom';
import { screen } from '@testing-library/react';
import { TestHelper } from '../../utils/test/TestHelper';
import sinon from 'sinon';
import { TextChanged, TextEnd, TextEvent, TextStart } from './TextInteractionEvents';
import userEvent from '@testing-library/user-event';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';

describe('TextInteraction', () => {
  let mapTarget: HTMLDivElement;
  let source: VectorSource<Geometry>;
  let interaction: TextInteraction;

  beforeEach(() => {
    mapTarget = document.createElement('div');
    mapTarget.style.width = '800px';
    mapTarget.style.height = '600px';

    source = new VectorSource();
    interaction = new TextInteraction({ source });
  });

  it('should do nothing if no features found', () => {
    const event = TestHelper.mapBrowserEvent({ button: 0 });

    interaction.handleEvent(event);

    expect(screen.queryByTestId('textarea')).toBeNull();
  });

  it('should show text input and dispatch if feature found', () => {
    // Prepare
    const handler = sinon.stub();
    interaction.addEventListener(TextEvent.Start, handler);
    interaction.addEventListener(TextEvent.Changed, handler);
    interaction.addEventListener(TextEvent.End, handler);

    const feature = FeatureWrapper.create(new Point([1, 1]));
    feature.setText('Hello');
    source.addFeature(feature.unwrap());

    const event = TestHelper.mapBrowserEvent({ button: 0, coordinate: [1, 1], mapTarget });

    // Act
    interaction.handleEvent(event);
    userEvent.type(screen.getByTestId('textarea'), '!');
    userEvent.click(screen.getByTestId('button'));

    // Assert
    expect(handler.callCount).toEqual(3);

    const textStart = handler.args[0][0] as TextStart;
    expect(textStart).toBeInstanceOf(TextStart);
    expect(textStart.text).toStrictEqual('Hello');
    expect(textStart.feature).toStrictEqual(feature.unwrap());

    const textChanged = handler.args[1][0] as TextChanged;
    expect(textChanged).toBeInstanceOf(TextChanged);
    expect(textChanged.text).toStrictEqual('Hello!');
    expect(textChanged.feature).toStrictEqual(feature.unwrap());

    const textEnd = handler.args[2][0] as TextEnd;
    expect(textEnd).toBeInstanceOf(TextEnd);
    expect(textEnd.text).toStrictEqual('Hello!');
    expect(textEnd.feature).toStrictEqual(feature.unwrap());

    expect(screen.queryByTestId('textarea')).toBeNull();
  });

  it('should close on backdrop click', () => {
    // Prepare
    const handler = sinon.stub();
    interaction.addEventListener(TextEvent.End, handler);

    const feature = FeatureWrapper.create(new Point([1, 1]));
    source.addFeature(feature.unwrap());

    const event = TestHelper.mapBrowserEvent({ button: 0, coordinate: [1, 1], mapTarget });

    // Act
    interaction.handleEvent(event);
    userEvent.click(screen.getByTestId('backdrop'));

    // Assert
    expect(handler.callCount).toEqual(1);
    expect(handler.args[0][0]).toBeInstanceOf(TextEnd);
    expect(screen.queryByTestId('textarea')).toBeNull();
  });
});
