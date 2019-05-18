import {OlCircle, OlFeature, OlFill, OlRenderFeature, OlStroke, OlStyle} from '../OpenLayersImports';
import {OpenLayersHelper} from './OpenLayersHelper';


// TODO: check relations to geojson properties

// TODO: improve style structure
// TODO: add stroke width
// TODO: add icons for points
// TODO: add text style

const defaultStyle = new OlStyle({
  fill: new OlFill({color: 'navy'}),
  stroke: new OlStroke({color: 'black', width: 5}),
  image: new OlCircle({
    radius: 7,
    fill: new OlFill({color: 'red'}),
    stroke: new OlStroke({color: 'black', width: 5}),
  })
});

// TODO: use cache ?
// WARNING: this function is called to render features on map, it MUST be very fast
export function abcStyleRendering(feature: (OlFeature | OlRenderFeature), resolution: number): (OlStyle | OlStyle[] | null) {

  const abcStyle = OpenLayersHelper.getStyle(feature);

  if (!abcStyle) {
    return defaultStyle;
  }

  const stroke = new OlStroke({
    color: abcStyle.foreground,
    width: abcStyle.strokeWidth,
  });

  const fill = new OlFill({
    color: abcStyle.background,
  });

  return new OlStyle({
    fill,
    stroke,
    image: new OlCircle({
      radius: abcStyle.strokeWidth, fill, stroke,
    })
  });

}
