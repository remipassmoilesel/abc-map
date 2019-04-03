<template>
    <div class="main-map-wrapper">
        <div id="openlayers-map"></div>
        <div style="display: none">{{ project }}</div>
    </div>
</template>

<script lang="ts">
import * as ol from 'openlayers';
import * as _ from 'lodash';
import {Component} from 'vue-property-decorator';
import {AbcExtendedVue} from '@/lib/utils/AbcExtendedVue';
import {IProject} from "../../../shared/dist";

@Component({
    components: {},
})
export default class MainMap extends AbcExtendedVue {

    public map?: ol.Map;

    mounted() {
        this.setupMap();
    }

    updated() {
        if(!this.map || !this.project){
            return;
        }
        const _map = this.map;
        const olLayers = this.abcServices.map.generateLayersFromProject(this.project);

        // TODO: remove/add only diff
        _map.getLayers().forEach(lay => _map.removeLayer(lay));
        _.forEach(olLayers, lay => _map.addLayer(lay));
    }

    setupMap() {
        this.map = new ol.Map({
            target: 'openlayers-map',
            layers: [],
            view: new ol.View({
                center: ol.proj.fromLonLat([37.41, 8.82]),
                zoom: 4,
            }),
        });
    }

    get project(): IProject | null {
        return this.abcStorew.project.getCurrentProject();
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
