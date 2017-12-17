import {TestManTest} from "../../tests/gui/TestManTest";
import {TestMan} from "./TestMan";
import {UiSearchableComponentsTest} from "../../tests/gui/components/UiSearchableComponentsTest";

// TODO: do not import them in prod env ?

const testMan = new TestMan();
testMan.addTestClass(new TestManTest());
testMan.addTestClass(new UiSearchableComponentsTest());

setTimeout(() => {
    testMan.runTests();
}, 1000);
