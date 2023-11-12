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

import { IconProcessor, mountSvg } from './IconProcessor';
import { IconCategory, IconName, PointIcon } from '@abc-map/point-icons';

describe('IconProcessor', () => {
  const fakeIcon: PointIcon = {
    name: 'Test icon' as IconName,
    category: IconCategory.Geometries,
  };

  it('prepareSvg() with sample svg and dynamic colors', () => {
    // Act
    const actual = IconProcessor.get().prepareSvg({ ...fakeIcon, staticColors: false }, sampleSvg(), 500, '#FF0000');

    // Assert
    expect(actual).toMatch(/^data:image\/svg\+xml;base64,.+/);

    const { svg } = mountSvg(atob(actual.substring(26)));
    expect(svg.getAttribute('width')).toEqual('500');
    expect(svg.getAttribute('height')).toEqual('500');

    const rect = svg.querySelector('rect') as SVGElement;
    expect(rect.getAttribute('style')).toEqual('fill: #FF0000; stroke: none; stroke-width: 0.200643; stroke-linejoin: round;');
  });

  it('prepare() with sample svg and static colors', () => {
    // Act
    const actual = IconProcessor.get().prepareSvg({ ...fakeIcon, staticColors: true }, sampleSvg(), 500, '#FF0000');

    // Assert
    expect(actual).toMatch(/^data:image\/svg\+xml;base64,.+/);

    const { svg } = mountSvg(atob(actual.substring(26)));
    expect(svg.getAttribute('width')).toEqual('500');
    expect(svg.getAttribute('height')).toEqual('500');

    const rect = svg.querySelector('rect') as SVGElement;
    expect(rect.getAttribute('style')).toEqual('fill:#3e3e3e;stroke:none;stroke-width:0.200643;stroke-linejoin:round');
  });
});

export function sampleSvg(): string {
  return `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   width="50"
   height="50"
   viewBox="0 0 13.229166 13.229167"
   version="1.1"
   fill="yellow"
   id="svg8">
  <defs id="defs2" />
  <metadata
     id="metadata5">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title />
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g id="layer1">
    <rect
       style="fill:#3e3e3e;stroke:none;stroke-width:0.200643;stroke-linejoin:round"
       id="rect833"
       width="13.089589"
       height="13.104071"
       x="0.069788776"
       y="0.062548004"
       ry="0.58187973" />
  </g>
</svg>
`;
}
