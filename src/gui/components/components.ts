import Vue from 'vue';
import {NavbarComponent} from './navbar/NavbarComponent';
import {LeftMenuComponent} from './left-menu/LeftMenuComponent';
import {GeoMapComponent} from './map/GeoMapComponent';
import {StatusBarComponent} from "./status-bar/StatusBarComponent";
import {StoreUpdaterComponent} from "./store-updater/StoreUpdaterComponent";
import {LayerSelectorComponent} from "./layer-selector/LayerSelectorComponent";
import {DataImporterComponent} from "./data-importer/DataImporterComponent";
import {GeoSearchComponent} from "./geo-search/GeoSearchComponent";
import {ActionDialogComponent} from "./action-dialog/ActionDialogComponent";
import {AddLayerComponent} from "./add-layer/AddLayerComponent";
import {UiSearchableComponents} from "./UiSearchableComponents";
import {ActionDialogResultComponent} from "./action-dialog-result/ActionDialogResultComponent";
import {AbstractUiComponent} from "./AbstractUiComponent";
import * as _ from "lodash";
import * as assert from "assert";

export const uxSearchableComponents = new UiSearchableComponents();

const components: AbstractUiComponent [] = [
    new AddLayerComponent(),
    new NavbarComponent(),
    new LeftMenuComponent(),
    new GeoMapComponent(),
    new LayerSelectorComponent(),
    new StatusBarComponent(),
    new StoreUpdaterComponent(),
    new DataImporterComponent(),
    new GeoSearchComponent(),
    new ActionDialogComponent(),
    new ActionDialogResultComponent(),
];

const checkInstance = (inst: AbstractUiComponent) => {
    assert.ok(inst.componentName && inst.componentName.length > 1);
    assert.ok(inst.componentDescription && inst.componentDescription.length > 1);
    assert.ok(inst.componentTagName && inst.componentTagName.length > 1);
};

_.forEach(components, (instance: AbstractUiComponent) => {

    checkInstance(instance);

    // register components globally
    Vue.component(instance.componentTagName, instance.constructor);

    // register searchable components
    if (instance.componentIsSearchable) {
        uxSearchableComponents.addComponent(instance);
    }

});

