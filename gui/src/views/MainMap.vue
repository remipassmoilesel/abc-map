<template>
    <div class="main-map-wrapper">
        <div id="openlayers-map"></div>
    </div>
</template>

<script lang="ts">
import * as ol from 'openlayers';
import {Component} from 'vue-property-decorator';
import {AbcExtendedVue} from '@/lib/utils/AbcExtendedVue';

@Component({
    components: {},
})
export default class MainMap extends AbcExtendedVue {

    public map?: ol.Map;

    public mounted() {
        this.setupDefaultMap();
    }

    public setupDefaultMap() {
        this.map = new ol.Map({
            target: 'openlayers-map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([37.41, 8.82]),
                zoom: 4,
            }),
        });

    }

}
</script>

<style lang="scss">

    #openlayers-map {
        position: absolute;
        width: 100%;
        height: 94%;
    }

</style>
