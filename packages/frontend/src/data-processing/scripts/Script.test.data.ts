export const FirefoxStack = `
anonymous@http://localhost:3005/static/js/main.chunk.js line 26756 > AsyncFunction:4:7
process@http://localhost:3005/static/js/main.chunk.js:26923:12
onProcess@http://localhost:3005/static/js/main.chunk.js:26904:29
ScriptsUI/this.execute@http://localhost:3005/static/js/main.chunk.js:27611:18
callCallback@http://localhost:3005/static/js/vendors~main.chunk.js:226202:18
invokeGuardedCallbackDev@http://localhost:3005/static/js/vendors~main.chunk.js:226251:20
invokeGuardedCallback@http://localhost:3005/static/js/vendors~main.chunk.js:226311:35
invokeGuardedCallbackAndCatchFirstError@http://localhost:3005/static/js/vendors~main.chunk.js:226326:29
executeDispatch@http://localhost:3005/static/js/vendors~main.chunk.js:230561:46
processDispatchQueueItemsInOrder@http://localhost:3005/static/js/vendors~main.chunk.js:230593:26
processDispatchQueue@http://localhost:3005/static/js/vendors~main.chunk.js:230606:41
dispatchEventsForPlugins@http://localhost:3005/static/js/vendors~main.chunk.js:230617:27
dispatchEventForPluginEventSystem/<@http://localhost:3005/static/js/vendors~main.chunk.js:230828:16
batchedEventUpdates$1@http://localhost:3005/static/js/vendors~main.chunk.js:244513:16
batchedEventUpdates@http://localhost:3005/static/js/vendors~main.chunk.js:226000:16
dispatchEventForPluginEventSystem@http://localhost:3005/static/js/vendors~main.chunk.js:230827:26
`;

export const ChromiumStack = `
Error: Hey hey
    at eval (eval at from (http://localhost:3005/static/js/main.chunk.js:26756:100), <anonymous>:4:7)
    at Scripts.process (http://localhost:3005/static/js/main.chunk.js:26923:12)
    at Object.onProcess (http://localhost:3005/static/js/main.chunk.js:26904:29)
    at ScriptsUI.execute (http://localhost:3005/static/js/main.chunk.js:27611:18)
    at HTMLUnknownElement.callCallback (http://localhost:3005/static/js/vendors~main.chunk.js:226202:18)
    at Object.invokeGuardedCallbackDev (http://localhost:3005/static/js/vendors~main.chunk.js:226251:20)
    at invokeGuardedCallback (http://localhost:3005/static/js/vendors~main.chunk.js:226311:35)
    at invokeGuardedCallbackAndCatchFirstError (http://localhost:3005/static/js/vendors~main.chunk.js:226326:29)
    at executeDispatch (http://localhost:3005/static/js/vendors~main.chunk.js:230561:7)
    at processDispatchQueueItemsInOrder (http://localhost:3005/static/js/vendors~main.chunk.js:230593:11)
    at processDispatchQueue (http://localhost:3005/static/js/vendors~main.chunk.js:230606:9)
    at dispatchEventsForPlugins (http://localhost:3005/static/js/vendors~main.chunk.js:230617:7)
    at http://localhost:3005/static/js/vendors~main.chunk.js:230828:16
    at batchedEventUpdates$1 (http://localhost:3005/static/js/vendors~main.chunk.js:244513:16)
    at batchedEventUpdates (http://localhost:3005/static/js/vendors~main.chunk.js:226000:16)
`;
