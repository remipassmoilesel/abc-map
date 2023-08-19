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

import { FeatureSelection } from './FeatureSelection';
import { FeatureWrapper } from '../features/FeatureWrapper';

describe('FeatureSelection', () => {
  let selection: FeatureSelection;

  beforeEach(() => {
    selection = new FeatureSelection();
  });

  it('add()', () => {
    // Prepare
    const features = [FeatureWrapper.create(), FeatureWrapper.create()];

    // Act
    selection.add(features);

    // Assert
    expect(features.map((f) => f.isSelected())).toEqual([true, true]);
    expect(
      selection
        .getFeatures()
        .map((f) => f.getId())
        .sort()
    ).toEqual(features.map((f) => f.getId()).sort());
  });

  it('remove()', () => {
    // Prepare
    const features = [FeatureWrapper.create(), FeatureWrapper.create()];
    selection.add(features);

    // Act
    selection.remove(features);

    // Assert
    expect(features.map((f) => f.isSelected())).toEqual([false, false]);
    expect(selection.getFeatures()).toEqual([]);
  });

  it('add to feature collection', () => {
    // Prepare
    const features = [FeatureWrapper.create(), FeatureWrapper.create()];

    // Act
    features.forEach((f) => selection.getFeatureCollection().push(f.unwrap()));

    // Assert
    expect(features.map((f) => f.isSelected())).toEqual([true, true]);
    expect(
      selection
        .getFeatures()
        .map((f) => f.getId())
        .sort()
    ).toEqual(features.map((f) => f.getId()).sort());
  });

  it('remove from feature collection', () => {
    // Prepare
    const features = [FeatureWrapper.create(), FeatureWrapper.create()];
    selection.add(features);

    // Act
    features.forEach((f) => selection.getFeatureCollection().remove(f.unwrap()));

    // Assert
    expect(features.map((f) => f.isSelected())).toEqual([false, false]);
    expect(selection.getFeatures()).toEqual([]);
  });

  it('isSelected()', () => {
    const features = [FeatureWrapper.create(), FeatureWrapper.create()];
    selection.add([features[0]]);

    expect(selection.isSelected(features[0])).toBe(true);
    expect(selection.isSelected(features[1])).toBe(false);
  });
});
