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

import { IconProcessor, mountSvg } from './IconProcessor';
import { PointIcon, safeGetIcon } from '../../../assets/point-icons/PointIcon';
import sinon from 'sinon';
import { IconName } from '../../../assets/point-icons/IconName';
import { IconCategory } from '../../../assets/point-icons/IconCategory';

describe('IconProcessor', () => {
  const fakeIcon: PointIcon = {
    name: 'Test icon' as IconName,
    contentSvg: sample(),
    category: IconCategory.Geometries,
  };

  it('prepare() with sample', () => {
    // Act
    const actual = IconProcessor.get().prepare(fakeIcon, 500, '#FF0000');

    // Assert
    expect(actual).toMatch(/^data:image\/svg\+xml;base64,.+/);

    const { svg } = mountSvg(atob(actual.substr(26)));
    expect(svg.getAttribute('width')).toEqual('500');
    expect(svg.getAttribute('height')).toEqual('500');

    const rect = svg.querySelector('rect') as SVGElement;
    expect(rect.getAttribute('style')).toEqual('fill: #FF0000; stroke: none; stroke-width: 0.200643; stroke-linejoin: round;');
  });

  it('prepare() with icon from library', () => {
    // Act
    const icon = safeGetIcon(IconName.Icon0CircleFill);
    const actual = IconProcessor.get().prepare(icon, 500, '#FF0000');

    // Assert
    expect(actual).toMatch(/^data:image\/svg\+xml;base64,.+/);

    const { svg } = mountSvg(atob(actual.substr(26)));
    expect(svg.getAttribute('fill')).toEqual('#FF0000');
  });

  describe('prepareCached()', () => {
    it('should set cache then return', () => {
      // Prepare
      const cache = sinon.createStubInstance(Map);
      const instance = new IconProcessor(cache as unknown as Map<string, string>);
      cache.get.returns(undefined);

      // Act
      const actual = instance.prepareCached(fakeIcon, 500, '#FF0000');

      // Assert
      expect(cache.get.callCount).toEqual(1);
      expect(cache.set.callCount).toEqual(1);
      expect(cache.set.args[0][0]).toEqual('["Test icon",500,"#FF0000"]');
      expect(cache.set.args[0][1]).toMatch(/^data:image\/svg\+xml;base64,.+/);
      expect(actual).toMatch(/^data:image\/svg\+xml;base64,.+/);
    });

    it('should get cache then return', () => {
      // Prepare
      const cache = sinon.createStubInstance(Map);
      const instance = new IconProcessor(cache as unknown as Map<string, string>);
      cache.get.returns('test cache content');

      // Act
      const actual = instance.prepareCached(fakeIcon, 500, '#FF0000');

      // Assert
      expect(cache.get.callCount).toEqual(1);
      expect(cache.set.callCount).toEqual(0);
      expect(actual).toEqual('test cache content');
    });
  });
});

export function sample(): string {
  return `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="50"
   height="50"
   viewBox="0 0 13.229166 13.229167"
   version="1.1"
   id="svg8"
   inkscape:version="1.0.2 (e86c870879, 2021-01-15, custom)"
   sodipodi:docname="square.svg"
   inkscape:export-filename="/home/remo/projects/abcmap/abc-map-2.263/packages/frontend/src/assets/point-icons/square.png"
   inkscape:export-xdpi="96"
   inkscape:export-ydpi="96">
  <defs
     id="defs2" />
  <sodipodi:namedview
     id="base"
     pagecolor="#cccccc"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0"
     inkscape:pageshadow="2"
     inkscape:zoom="15.839192"
     inkscape:cx="21.22767"
     inkscape:cy="18.303517"
     inkscape:document-units="mm"
     inkscape:current-layer="layer1"
     inkscape:document-rotation="0"
     showgrid="false"
     units="px"
     inkscape:window-width="1920"
     inkscape:window-height="1015"
     inkscape:window-x="0"
     inkscape:window-y="0"
     inkscape:window-maximized="1" />
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
  <g
     inkscape:label="Calque 1"
     inkscape:groupmode="layer"
     id="layer1">
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
