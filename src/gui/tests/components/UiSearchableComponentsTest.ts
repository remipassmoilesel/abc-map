import {UiComponent} from "../../components/UiComponent";
import {UiSearchableComponents} from "../../components/UiSearchableComponents";
import {AbstractTest} from "../../test-man/AbstractTest";


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
        searchables.addAction(new TestComponent('LOCATION in title', 'Location in description'));
        searchables.addAction(new TestComponent('Map in title', 'Location in description'));
        searchables.addAction(new TestComponent('Circles', 'MAP in description'));

        const locationResults = searchables.search('loCAtion');
        const mapResults = searchables.search('map');
        const nothingResults = searchables.search('nothing');

        console.log(locationResults);

        this.assert.equal(locationResults.length, 2);
        this.assert.equal(locationResults[0].score, 5);
        this.assert.equal(locationResults[1].score, 2);

        this.assert.equal(mapResults.length, 2);
        this.assert.equal(locationResults[0].score, 3);
        this.assert.equal(locationResults[1].score, 2);

        this.assert.equal(nothingResults.length, 0);

    }

}
