import {TestManTest} from './test-man/TestManTest';
import {TestMan} from './test-man/TestMan';
import {UiSearchableComponentsTest} from './components/UiSearchableComponentsTest';
import {MapClientTest} from './clients/MapClientTest';
import {EntitySerializerTest} from './utils/EntitySerializerTest';
import {LayerSelectorTest} from './components/LayerSelectorTest';

// TODO: do not import tests in prod env ?

const testMan = new TestMan();
testMan.addTestClass(new TestManTest());
testMan.addTestClass(new UiSearchableComponentsTest());
testMan.addTestClass(new MapClientTest());
testMan.addTestClass(new EntitySerializerTest());
testMan.addTestClass(new LayerSelectorTest());

// TODO: transmit return code and logs to main process then restore
// this.setFinalHandler(() => {
//     window.close();
// });

testMan.init();
