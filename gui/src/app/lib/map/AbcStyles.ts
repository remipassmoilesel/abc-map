import {OlFeature, OlFill, OlRenderFeature, OlStroke, OlStyle} from '../OpenLayersImports';
import {OpenLayersHelper} from './OpenLayersHelper';

export interface IAbcStyleContainer {
  foreground: string;
  background: string;
}

// TODO: USE CACHE EVERYWHERE !!!

const defaultStyle = new OlStyle({
  fill: new OlFill({color: 'navy'}),
  stroke: new OlStroke({color: 'black', width: 1})
});

export function abcStyleToOlStyle(feature: (OlFeature | OlRenderFeature), resolution: number): (OlStyle | OlStyle[] | null) {

  const abcStyle = OpenLayersHelper.getStyle(feature);
  if (!abcStyle) {
    return defaultStyle;
  }

  return [
    new OlStyle({
      fill: new OlFill({color: abcStyle.background}),
      stroke: new OlStroke({color: abcStyle.foreground, width: 1})
    })
  ];

}
