import {TestManTest} from "./TestManTest";
import {TestMan} from "./TestMan";

// TODO: do not import them in prod env ?

const testMan = new TestMan();
testMan.addTestClass(new TestManTest());

setTimeout(() => {
    testMan.runTests();
}, 1000);
