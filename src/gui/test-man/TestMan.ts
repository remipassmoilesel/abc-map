import {AbstractTest} from "./AbstractTest";
import {AssertionError} from "chai";
import * as _ from "lodash";

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

        // filter classes marked with 'only'
        const withOnly = _.filter(this.testClasses, (testClass: AbstractTest) => {
            return testClass.only;
        });

        const classesToRun = withOnly.length > 0 ? withOnly : this.testClasses;

        for (const testClass of classesToRun) {

            this.log('INFO', 'Test class: ' + testClass.name);

            await this.runBeforeHook(testClass);

            for (const test of testClass.tests) {
                try {

                    this.log('INFO', `[${testClass.name}] Starting: ${test.name}`);

                    await this.runBeforeEachHook(testClass);

                    const ret = test.bind(testClass)();
                    if (ret && ret.then && ret.catch) {
                        await ret;
                    }

                    await this.runAfterEachHook(testClass);

                    await this.reportSuccess(testClass, test);

                } catch (e) {
                    await this.reportFail(testClass, test, e);
                }
            }

            await this.runAfterHook(testClass);

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

    private async reportSuccess(testClass: AbstractTest, test: any) {
        await this.log('SUCCESS', `[${testClass.name}] ${test.name}`);
    }

    private async reportFail(testClass: AbstractTest, test: any, e: any) {
        await this.log('FAIL', `[${testClass.name}] ${test.name}`, e);
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

    private async runBeforeHook(testClass: AbstractTest) {
        try {
            const p = testClass.before();
            if (p && p.then && p.catch) {
                await p;
            }
        } catch (e) {
            await this.reportFail(testClass, {name: 'before() hook'}, e);
        }
    }

    private async runBeforeEachHook(testClass: AbstractTest) {
        try {
            const pbe = testClass.beforeEach();
            if (pbe && pbe.then && pbe.catch) {
                await pbe;
            }
        } catch (e) {
            await this.reportFail(testClass, {name: 'beforeEach() hook'}, e);
        }
    }

    private async runAfterHook(testClass: AbstractTest) {
        try {
            const p = testClass.after();
            if (p && p.then && p.catch) {
                await p;
            }
        } catch (e) {
            await this.reportFail(testClass, {name: 'after() hook'}, e);
        }
    }

    private async runAfterEachHook(testClass: AbstractTest) {
        try {
            const pbe = testClass.afterEach();
            if (pbe && pbe.then && pbe.catch) {
                await pbe;
            }
        } catch (e) {
            await this.reportFail(testClass, {name: 'afterEach() hook'}, e);
        }
    }

}