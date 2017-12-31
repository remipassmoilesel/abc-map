import {store} from '../lib/store/store';

export class TestUtils {

    /**
     * Instantiate a vue component with all parameters values required
     *
     * TODO: parent should be undefined too, provide it ?
     *
     * @param constructor
     * @returns {any}
     */
    public static newVueComponent(constructor: any) {
        return new constructor({store}).$mount();
    }
}
