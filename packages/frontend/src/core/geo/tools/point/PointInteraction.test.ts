import { PointInteraction } from './PointInteraction';
import VectorSource from 'ol/source/Vector';
import { Map } from 'ol';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { FeatureBeingCreated, FeatureCreated, GeometryBeingUpdated, GeometryUpdated, ToolEvent } from '../common/ToolEvent';
import Geometry from 'ol/geom/Geometry';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';

describe('Point interaction', () => {
  let map: Map;
  let source: VectorSource;
  let eventHandler: SinonStub;
  let interaction: PointInteraction;

  beforeEach(() => {
    eventHandler = sinon.stub();
    source = new VectorSource<Geometry>();
    map = new Map({});
    interaction = new PointInteraction({ map, source });

    interaction.on(ToolEvent.FeatureBeingCreated, eventHandler);
    interaction.on(ToolEvent.FeatureCreated, eventHandler);
    interaction.on(ToolEvent.GeometryBeingUpdated, eventHandler);
    interaction.on(ToolEvent.GeometryUpdated, eventHandler);
  });

  it('should do nothing with shift key', () => {
    // Prepare
    const downEvent = mapBrowserEvent(map, { type: MapBrowserEventType.POINTERDOWN, shiftKey: true });

    // Act
    const propagate = interaction.handleEvent(downEvent);

    // Assert
    expect(propagate).toEqual(true);
    expect(eventHandler.callCount).toEqual(0);
  });

  it('should create on click', () => {
    // Prepare
    const downEvent = mapBrowserEvent(map, { type: MapBrowserEventType.POINTERDOWN, coords: [2, 2] });
    const upEvent = mapBrowserEvent(map, { type: MapBrowserEventType.POINTERUP });

    // Act
    const propagateDown = interaction.handleEvent(downEvent);
    const propagateUp = interaction.handleEvent(upEvent);

    // Assert
    expect(propagateDown).toEqual(false);
    expect(propagateUp).toEqual(false);
    expect(eventHandler.callCount).toEqual(2);

    const beingCreatedEvent = eventHandler.args[0][0] as FeatureBeingCreated;
    expect(beingCreatedEvent).toBeInstanceOf(FeatureBeingCreated);
    expect(beingCreatedEvent.feature).toBeInstanceOf(Feature);

    const createdEvent = eventHandler.args[1][0] as FeatureCreated;
    expect(createdEvent).toBeInstanceOf(FeatureCreated);
    expect(createdEvent.feature).toBeInstanceOf(Feature);

    expect(source.getFeatures()).toEqual([createdEvent.feature]);
    const point = source.getFeatures()[0].getGeometry() as Point;
    expect(point.getCoordinates()).toEqual([2, 2]);
  });

  it('should modify on drag', () => {
    // Prepare
    const downEvent = mapBrowserEvent(map, { type: MapBrowserEventType.POINTERDOWN, coords: [2, 2] });
    const dragEvent = mapBrowserEvent(map, { type: MapBrowserEventType.POINTERDRAG, coords: [5, 5] });
    const upEvent = mapBrowserEvent(map, { type: MapBrowserEventType.POINTERUP });

    source.addFeature(new Feature<Geometry>(new Point([2, 2])));

    // Act
    const propagateDown = interaction.handleEvent(downEvent);
    const propagateDrag = interaction.handleEvent(dragEvent);
    const propagateUp = interaction.handleEvent(upEvent);

    // Assert
    expect(propagateDown).toEqual(false);
    expect(propagateDrag).toEqual(false);
    expect(propagateUp).toEqual(false);
    expect(eventHandler.callCount).toEqual(2);

    const beingUpdatedEvent = eventHandler.args[0][0] as GeometryBeingUpdated;
    expect(beingUpdatedEvent).toBeInstanceOf(GeometryBeingUpdated);
    expect(beingUpdatedEvent.feature).toBeInstanceOf(Feature);

    const updatedEvent = eventHandler.args[1][0] as GeometryUpdated;
    expect(updatedEvent).toBeInstanceOf(GeometryUpdated);
    expect(updatedEvent.feature).toBeInstanceOf(Feature);

    expect(source.getFeatures()).toEqual([updatedEvent.feature]);
    const point = source.getFeatures()[0].getGeometry() as Point;
    expect(point.getCoordinates()).toEqual([5, 5]);
  });
});

interface EventOptions {
  button?: number;
  type?: MapBrowserEventType;
  coords?: Coordinate;
  shiftKey?: boolean;
}

function mapBrowserEvent(map: Map, options?: EventOptions): MapBrowserEvent {
  const originalEvent = ({ button: options?.button || 0, shiftKey: options?.shiftKey ?? false } as unknown) as UIEvent;
  const ev = new MapBrowserEvent(options?.type || MapBrowserEventType.POINTERDOWN, map, originalEvent);
  ev.coordinate = options?.coords || [1, 1];
  return ev;
}
