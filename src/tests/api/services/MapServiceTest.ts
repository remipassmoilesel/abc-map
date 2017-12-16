import * as chai from 'chai';
import * as _ from 'lodash';
import {TestUtils} from "../TestUtils";
import {MapService} from "../../../api/services/MapService";
import {GeocodingResult} from "../../../api/entities/GeocodingResult";
import {INominatimResult, NominatimGeocoder} from "../../../api/geocoder/NominatimGeocoder";
import {TestData} from "../TestData";

const assert = chai.assert;

describe('MapService', () => {

    it('Nominatim results signature should be exact', () => {

        const ngeo = new NominatimGeocoder();
        const interfaceKeys = _.keys(TestData.NOMINATIM_RESULT);

        return ngeo.requestRaw('cournonterral').then((results: INominatimResult[]) => {
            assert.lengthOf(results, 2);
            _.forEach(results, (res) => {
                assert.deepEqual(_.keys(res), interfaceKeys);
            });
        });

    });

    it('Geocode should not fail', () => {

        const {ipc} = TestUtils.getStubbedIpc();
        const ms = new MapService(ipc);

        return ms.geocode('cournonterral').then((results: GeocodingResult[]) => {
            assert.lengthOf(results, 2);
        });

    });

});
