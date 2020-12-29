import GeometryType from 'ol/geom/GeometryType';
import { DragBox, Draw, Interaction, Modify, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Logger } from '../utils/Logger';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Map } from 'ol';
import { DrawEvent } from 'ol/interaction/Draw';
import { VectorStyles } from './VectorStyles';
import { AbcStyle } from './AbcStyle';
import { FeatureHelper } from './FeatureHelper';
import { Task } from '../history/Task';
import { AddFeatureTask } from '../history/AddFeatureTask';

const logger = Logger.get('DrawingTools.ts', 'info');

export declare type GetStyleFunc = () => AbcStyle;
export declare type RegisterTaskFunc = (task: Task) => void;
export declare type DrawingToolFactoryFunc = (source: VectorSource<Geometry>, map: Map, style: GetStyleFunc, registerTask: RegisterTaskFunc) => Interaction[];

export interface DrawingTool {
  id: string;
  label: string;
  // TODO: create and use correctly icons
  icon: string;
  factory: DrawingToolFactoryFunc;
}

export class DrawingTools {
  public static readonly None: DrawingTool = {
    id: 'none',
    label: 'Aucun',
    icon: 'AU',
    factory: () => [],
  };

  public static readonly Point: DrawingTool = {
    id: 'point',
    label: 'Point',
    icon: 'PT',
    factory: (source, map, style, registerTask) => {
      const draw = new Draw({
        source,
        type: GeometryType.POINT,
        condition: onlyMainButton,
        finishCondition: onlyMainButton,
      });
      applyStyleAfterDraw(draw, style);
      registerTaskOnDraw(draw, source, registerTask);
      return [draw, ...commonModifyInteractions(source)];
    },
  };

  public static readonly LineString: DrawingTool = {
    id: 'line',
    label: 'Ligne',
    icon: 'LI',
    factory: (source, map, style, registerTask) => {
      const draw = new Draw({
        source,
        type: GeometryType.LINE_STRING,
        condition: onlyMainButton,
        finishCondition: onlyMainButton,
      });
      applyStyleAfterDraw(draw, style);
      registerTaskOnDraw(draw, source, registerTask);
      return [draw, ...commonModifyInteractions(source)];
    },
  };

  public static readonly Polygon: DrawingTool = {
    id: 'polygon',
    label: 'Polygone',
    icon: 'PL',
    factory: (source, map, style, registerTask) => {
      const draw = new Draw({
        source,
        type: GeometryType.POLYGON,
        condition: onlyMainButton,
        finishCondition: onlyMainButton,
      });
      applyStyleAfterDraw(draw, style);
      registerTaskOnDraw(draw, source, registerTask);
      return [draw, ...commonModifyInteractions(source)];
    },
  };

  public static readonly Circle: DrawingTool = {
    id: 'circle',
    label: 'Cercle',
    icon: 'CE',
    factory: (source, map, style, registerTask) => {
      const draw = new Draw({
        source,
        type: GeometryType.CIRCLE,
        condition: onlyMainButton,
        finishCondition: onlyMainButton,
      });
      applyStyleAfterDraw(draw, style);
      registerTaskOnDraw(draw, source, registerTask);
      return [draw, ...commonModifyInteractions(source)];
    },
  };

  public static readonly Selection: DrawingTool = {
    id: 'select',
    label: 'Selection',
    icon: 'SE',
    factory: (source) => {
      const dragBox = new DragBox({
        condition: onlyMainButton,
      });

      dragBox.on('boxstart', () => {
        source.forEachFeature((feature) => {
          FeatureHelper.setSelected(feature, false);
        });
      });

      dragBox.on('boxend', () => {
        const extent = dragBox.getGeometry().getExtent();
        source.forEachFeatureIntersectingExtent(extent, (feature) => {
          FeatureHelper.setSelected(feature, true);
        });
      });

      return [dragBox];
    },
  };

  public static readonly All: DrawingTool[] = [
    DrawingTools.None,
    DrawingTools.Point,
    DrawingTools.LineString,
    DrawingTools.Polygon,
    DrawingTools.Circle,
    DrawingTools.Selection,
  ];
}

/**
 * Condition that return true if event is main mouse button click event.
 *
 * Used with openlayers interactions.
 *
 * @param ev
 */
function onlyMainButton(ev: MapBrowserEvent<UIEvent>): boolean {
  const mainButton = 0;
  if (ev.originalEvent instanceof PointerEvent) {
    return ev.originalEvent.button === mainButton;
  }
  return false;
}

/**
 * Setup a listener on tool to apply current style after draw
 * @param draw
 * @param style
 */
function applyStyleAfterDraw(draw: Draw, style: GetStyleFunc): void {
  draw.on('drawend', (ev: DrawEvent) => {
    const feature = ev.feature;
    VectorStyles.setProperties(feature, style());
  });
}

function registerTaskOnDraw(draw: Draw, source: VectorSource, registerTask: RegisterTaskFunc): void {
  draw.on('drawend', (ev: DrawEvent) => {
    const feature = ev.feature;
    registerTask(new AddFeatureTask(source, feature));
  });
}

// FIXME: TODO: Modify cause a performance issue if we pass too many features
// FIXME: TODO: Here we should pass only features that are next to mouse, using throttled function
function commonModifyInteractions(source: VectorSource): Interaction[] {
  const modify = new Modify({ source });
  const snap = new Snap({ source });
  return [modify, snap];
}
