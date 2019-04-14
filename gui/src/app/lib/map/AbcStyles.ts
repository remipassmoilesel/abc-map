import {OlCircle, OlFeature, OlFill, OlRenderFeature, OlStroke, OlStyle} from '../OpenLayersImports';
import {OpenLayersHelper} from './OpenLayersHelper';

// TODO: improve style

export interface IAbcStyleContainer {
  foreground: string;
  background: string;
  width: number;
}

// TODO: USE CACHE EVERYWHERE !!!

const defaultStyle = new OlStyle({
  fill: new OlFill({color: 'navy'}),
  stroke: new OlStroke({color: 'black', width: 5}),
  image: new OlCircle({
    radius: 7,
    fill: new OlFill({color: 'red'}),
    stroke: new OlStroke({color: 'black', width: 5}),
  })
});

export function abcStyleToOlStyle(feature: (OlFeature | OlRenderFeature), resolution: number): (OlStyle | OlStyle[] | null) {

  const abcStyle = OpenLayersHelper.getStyle(feature);

  if (!abcStyle) {
    return defaultStyle;
  }

  const stroke = new OlStroke({
    color: abcStyle.foreground,
    width: abcStyle.width,
  });

  const fill = new OlFill({
    color: abcStyle.background,
  });

  return new OlStyle({
    fill,
    stroke,
    image: new OlCircle({
      radius: 7, fill, stroke,
    })
  });

}
