import {AbstractTest} from "./AbstractTest";
import {AssertionError} from "chai";

export class TestMan {

    private testClasses: AbstractTest[] = [];
    private finalHandler: Function;

    public addTestClass(test: AbstractTest) {
        this.testClasses.push(test);
    }

    public init() {
        if (process.env.NODE_ENV === 'test') {

            this.setFinalHandler(() => {
                window.close();
            });

            setTimeout(this.runTests(), 1000);
        }
    }

    public async runTests() {

        this.log('INFO', '===============');
        this.log('INFO', 'Starting tests');
        this.log('INFO', '===============');

        for (const testClass of this.testClasses) {

            this.log('INFO', 'Test class: ' + testClass.name);

            const p = testClass.before();
            if (p && p.then && p.catch) {
                await p;
            }

            for (const test of testClass.tests) {
                try {

                    this.log('INFO', `[${testClass.name}] Starting: ${test.name}`);

                    const pbe = testClass.beforeEach();
                    if (pbe && pbe.then && pbe.catch) {
                        await pbe;
                    }

                    const ret = test.bind(testClass)();
                    if (ret && ret.then && ret.catch) {
                        await ret;
                    }

                    const pae = testClass.afterEach();
                    if (pae && pae.then && pae.catch) {
                        await pae;
                    }

                    this.reportSuccess(testClass, test);

                } catch (e) {
                    this.reportFail(testClass, test, e);
                }
            }

            const pa = testClass.after();
            if (pa && pa.then && pa.catch) {
                await pa;
            }

            this.log('INFO', 'End of test class: ' + testClass.name);
        }

        this.log('INFO', 'End of tests');
        if (this.finalHandler) {
            this.finalHandler();
        }
    }

    public setFinalHandler(finalHandler: Function) {
        this.finalHandler = finalHandler;
    }

    private reportSuccess(testClass: AbstractTest, test: any) {
        this.log('SUCCESS', `[${testClass.name}] ${test.name}`);
    }

    private reportFail(testClass: AbstractTest, test: any, e: any) {
        this.log('FAIL', `[${testClass.name}] ${test.name}`, e);
    }

    private log(prefix: 'SUCCESS' | 'INFO' | 'FAIL', message: string, data?: any) {

        const logFunc = prefix === 'FAIL' ? console.error : console.info;
        logFunc(`[${prefix}] ${message}`);

        if (data && data instanceof AssertionError) {
            const error: any = data;
            logFunc('- Actual: ' + error.actual);
            logFunc('- Expected: ' + error.expected);
            logFunc('- Message: ' + error.message);
            logFunc('- Stack: ' + error.stack);
        }
        else if (data) {
            logFunc(JSON.stringify(data, null, 2));
        }
    }
}