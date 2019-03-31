<template>
    <div class="main-map-wrapper">
        <div id="openlayers-map"></div>
    </div>
</template>

<script lang="ts">
    import * as ol from 'openlayers';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class MainMap extends Vue {

        private map?: ol.Map;

        mounted() {
            this.map = new ol.Map({
                target: 'openlayers-map',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([37.41, 8.82]),
                    zoom: 4
                })
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
