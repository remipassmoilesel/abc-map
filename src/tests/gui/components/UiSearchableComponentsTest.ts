import {UiComponent} from "../../../gui/components/UiComponent";
import {UiSearchableComponents} from "../../../gui/components/UiSearchableComponents";
import {AbstractTest} from "../../../gui/test-man/AbstractTest";


class TestComponent extends UiComponent {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }
}

export class UiSearchableComponentsTest extends AbstractTest {
    public name: string = "UiSearchableComponentsTest";
    public only: boolean = true;

    public registerTests(): any[] {
        return [
            this.searchShouldWork
        ];
    }

    public searchShouldWork() {

        const searchables = new UiSearchableComponents();
        searchables.addAction(new TestComponent('Search location', 'Search a location and display it on map'));
        searchables.addAction(new TestComponent('Add a tile layer', 'Search and add tiles layers to your project'));
        searchables.addAction(new TestComponent('Draw circles', 'Draw circles on map'));

        this.assert.equal(searchables.search('map').length, 2);
    }

}
