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

import { Tip } from '../Tip';
import { ColorGradientTips, DataProcessingTips, ProportionalSymbolsTips } from '../tip-ids';

const Commons = [
  {
    id: DataProcessingTips.JoinBy,
    content: `<p>The <i>join field</i> is used to relate data and geometries. </p>
              <p>This field must contain a code that will be present in the geometry and in the data to be analyzed. Examples:</p>
              <ul>
                <li>Postal code</li>
                <li>department code</li>
                <li>region code</li>
                <li>country code</li>
              </ul>`,
  },
];

const ProportionalSymbols: Tip[] = [
  {
    id: ProportionalSymbolsTips.SizeField,
    content: `<p>The <i>Symbol size</i> field is used to determine the size of each symbol.</p>
              <p>This field must contain the data to be analyzed. Examples:</p>
              <ul>
                <li>population</li>
                <li>annual revenue</li>
                <li>GDP</li>
              </ul>`,
  },
  {
    id: ProportionalSymbolsTips.Algorithm,
    content: `<p>The symbol scale determines how the symbol size is calculated.</p>
              <ul>
                <li>On the <i>absolute scale</i> the sizes of the symbols are directly proportional to the values represented.
                The proportionality of the symbols is exact.</li>
                <li>On the <i>interpolated scale</i> the sizes of the symbols are distributed between the minimum size and the maximum size.
                The proportionality of the symbols is distorted. This scale is useful when the range of values is wide.</li>
              </ul>`,
  },
];

const ColorGradientSymbols: Tip[] = [
  {
    id: ColorGradientTips.ColorField,
    content: `<p>The <i>Colors</i> field is used to determine the color values.</p>
              <p>This field must contain the data to be analyzed. Examples:</p>
              <ul>
                <li>population density per km²</li>
                <li>annual income per capita</li>
              </ul>`,
  },
  {
    id: ColorGradientTips.Algorithm,
    content: `<p>The algorithm determines the method of calculating colors. Colors can be distributed on a scale
               or in classes (groups of values that share the same color).</p>
              <ul>
                <li>The <i>interpolated scale</i> distributes the values between the start color and the end color.</li>
                <li>With <i>Equal intervals</i> the amplitude between the minimum value and the maximum value is divided by the number of classes.</li>
                <li> With <i>Quantiles</i> each class represents the same amount of data. </li>
                <li> With the <i>Natural breaks</i> the values are grouped by proximity (Ckmeans algorithm). </li>
              </ul>`,
  },
];

export const DataProcessing: Tip[] = [...Commons, ...ProportionalSymbols, ...ColorGradientSymbols];
