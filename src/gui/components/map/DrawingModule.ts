/* tslint:disable object-literal-sort-keys */
import * as L from 'leaflet';
import {FeatureGroup, Map} from 'leaflet';

export class DrawingModule {
    private map: Map;
    private editableLayersGroup: FeatureGroup<any>;

    constructor(map: Map) {
        this.map = map;

        // create an editable group to store shapes
        this.editableLayersGroup = new L.FeatureGroup();
        this.map.addLayer(this.editableLayersGroup);

        // See https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/leaflet-draw/leaflet-draw-tests.ts
        const options = {
            position: 'topright',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#f357a1',
                        weight: 10,
                    },
                },
                polygon: {
                    // Restricts shapes to simple polygons
                    allowIntersection: false,
                    drawError: {
                        // Color the shape will turn when intersects
                        color: '#e1e100',
                        // Message that will show when intersect
                        message: '<strong>Oh snap!<strong> you can\'t draw that!',
                    },
                    shapeOptions: {
                        color: '#bada55',
                    },
                },
                circle: {},
                rectangle: {},
                marker: {},
            },
            edit: {
                featureGroup: this.editableLayersGroup, // REQUIRED!!
                remove: true,
            },
        };

        // add toolbar on tob of map
        const drawControl = new L.Control.Draw(options);
        this.map.addControl(drawControl);

        // listen for creation events
        this.map.on(L.Draw.Event.CREATED, this.onDrawCreated.bind(this));

    }

    private onDrawCreated(e: L.DrawEvents.Created) {
        const type = e.layerType;
        const layer = e.layer;

        if (type === 'marker') {
            // Do marker specific actions
        }

        // add created shapes to group of editable layers
        this.editableLayersGroup.addLayer(layer);

        // console.log(e);
    }


    public onMapComponentUpdated() {
        // re-add editable group on top
        this.map.addLayer(this.editableLayersGroup);
    }
}
