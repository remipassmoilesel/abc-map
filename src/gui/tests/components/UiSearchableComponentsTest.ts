import {AbstractUiComponent} from "../../components/AbstractUiComponent";
import {UiSearchableComponents} from "../../components/UiSearchableComponents";
import {AbstractTest} from "../test-man/AbstractTest";


class TestComponent extends AbstractUiComponent {
    componentName: string;
    componentDescription: string;
    componentTagName: string;

    constructor(name: string, description: string) {
        super();
        this.componentName = name;
        this.componentDescription = description;
        this.componentTagName = new Date().toString();
    }
}

export class UiSearchableComponentsTest extends AbstractTest {
    public name: string = "UiSearchableComponentsTest";

    public registerTests(): any[] {
        return [
            this.sameNamesShouldThrow,
            this.searchShouldWork,
            this.maximumNumberShouldBeApplied,
        ];
    }

    public sameNamesShouldThrow() {

        const searchables = new UiSearchableComponents();
        searchables.addComponent(new TestComponent('map', 'map'));

        this.assert.throws(() => {
            searchables.addComponent(new TestComponent('map', 'map'));
        });
    }

    public searchShouldWork() {

        const searchables = new UiSearchableComponents();
        searchables.addComponent(new TestComponent('LOCATION in title', 'Location in description'));
        searchables.addComponent(new TestComponent('Map in title', 'Location in description'));
        searchables.addComponent(new TestComponent('Circles', 'MAP in description'));

        const locationResults = searchables.search('loCAtion');
        const mapResults = searchables.search('map');
        const nothingResults = searchables.search('nothing');

        this.assert.equal(locationResults.length, 2);
        this.assert.equal(locationResults[0].score, 5);
        this.assert.equal(locationResults[1].score, 2);

        this.assert.equal(mapResults.length, 2);
        this.assert.equal(mapResults[0].score, 3);
        this.assert.equal(mapResults[1].score, 2);

        this.assert.equal(nothingResults.length, 0);

    }

    public maximumNumberShouldBeApplied() {

        const searchables = new UiSearchableComponents();
        searchables.addComponent(new TestComponent('map 1', 'map'));
        searchables.addComponent(new TestComponent('map 2', 'map'));
        searchables.addComponent(new TestComponent('map 3', 'map'));
        searchables.addComponent(new TestComponent('map 4', 'map'));
        searchables.addComponent(new TestComponent('map 5', 'map'));
        searchables.addComponent(new TestComponent('map 6', 'map'));

        const mapResults = searchables.search('map', 10);
        this.assert.equal(mapResults.length, 6);

        const mapResults2 = searchables.search('map', 3);
        this.assert.equal(mapResults2.length, 3);

    }

}
