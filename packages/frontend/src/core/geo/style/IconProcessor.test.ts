import { IconProcessor, mountSvg } from './IconProcessor';
import { PointIcon } from './PointIcons';
import { PointIcons } from '@abc-map/shared-entities';

// WARNING
//
// Test setup with Jest does not use webpack, but we mock webpack behavior with a transformer.
//

describe('IconProcessor', () => {
  it('prepare()', () => {
    const icon: PointIcon = {
      name: 'Test icon' as PointIcons,
      contentSvg: sample(),
    };

    const actual = IconProcessor.prepare(icon, 500, '#FF0000');
    expect(actual).toBeInstanceOf(HTMLImageElement);
    expect(actual.src).toMatch(/^data:image\/svg\+xml;base64,.+/);

    const { svg } = mountSvg(atob(actual.src.substr(26)));
    expect(svg.getAttribute('width')).toEqual('500');
    expect(svg.getAttribute('height')).toEqual('500');

    const rect = svg.querySelector('rect') as SVGElement;
    expect(rect.getAttribute('style')).toEqual('fill: #FF0000; stroke: none; stroke-width: 0.200643; stroke-linejoin: round;');
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
