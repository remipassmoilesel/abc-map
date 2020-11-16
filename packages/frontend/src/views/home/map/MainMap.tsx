import React, { Component, ReactNode } from 'react';
import { Map } from 'ol';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';

interface State {
  map?: Map;
}

class MainMap extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return <div className="map" id="map"></div>;
  }

  public componentDidMount() {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
      }),
    });

    this.setState({ map });
  }

  public componentWillUnmount() {
    this.state.map?.dispose();
  }
}

export default MainMap;
