import {TestManTest} from "../tests/TestManTest";
import {TestMan} from "./TestMan";
import {UiSearchableComponentsTest} from "../tests/components/UiSearchableComponentsTest";

// TODO: do not import them in prod env ?

const testMan = new TestMan();
testMan.addTestClass(new TestManTest());
testMan.addTestClass(new UiSearchableComponentsTest());

// TODO: transmit return code and logs to main process then restore
// this.setFinalHandler(() => {
//     window.close();
// });

testMan.init();
