import * as chai from 'chai';
import {UiComponent} from "../../../gui/components/UiComponent";
import {UiSearchableComponents} from "../../../gui/components/UiSearchableComponents";

const assert = chai.assert;

class TestComponent extends UiComponent {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }
}

describe.only('UiSearchableComponent', () => {

    it('Search should work', () => {

        const searchables = new UiSearchableComponents();
        searchables.addAction(new TestComponent('Search location', 'Search a location and display it on map'));
        searchables.addAction(new TestComponent('Add a tile layer', 'Search and add tiles layers to your project'));
        searchables.addAction(new TestComponent('Draw circles', 'Draw circles on map'));

        assert.equal(searchables.search('map').length, 2);

    });

});
