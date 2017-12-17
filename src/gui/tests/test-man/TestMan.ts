import {AbstractTest} from "./AbstractTest";
import {AssertionError} from "chai";
import * as _ from "lodash";
import * as $ from "jquery";

export class TestMan {

    private testClasses: AbstractTest[] = [];
    private finalHandler: Function;
    private logStack: any[] = [];

    public addTestClass(test: AbstractTest) {
        this.testClasses.push(test);
    }

    public init() {
        if (process.env.NODE_ENV === 'test') {
            setTimeout(this.runTests.bind(this), 1000);
        }
    }

    public async runTests() {

        this.logNewLine();
        this.logNewLine();
        this.log('INFO', '===============');
        this.log('INFO', 'Starting tests');
        this.log('INFO', '===============');

        // filter classes marked with 'only'
        const withOnly = _.filter(this.testClasses, (testClass: AbstractTest) => {
            return testClass.only;
        });

        const classesToRun = withOnly.length > 0 ? withOnly : this.testClasses;
        let stats = {
            classes: 0,
            tests: 0,
            passed: 0,
            failed: 0,
        };

        for (const testClass of classesToRun) {

            stats.classes++;

            this.logNewLine();
            this.logNewLine();
            this.log('INFO', ` *** Test class: ${testClass.name} ***`);

            await this.runBeforeHook(testClass);

            for (const test of testClass.tests) {

                stats.tests++;

                try {

                    this.logNewLine();
                    this.log('INFO', `[${testClass.name}] Starting: ${test.name}`);

                    await this.runBeforeEachHook(testClass);

                    const ret = test.bind(testClass)();
                    if (ret && ret.then && ret.catch) {
                        await ret;
                    }

                    await this.runAfterEachHook(testClass);

                    stats.passed++;
                    await this.reportSuccess(testClass, test);

                } catch (e) {
                    stats.failed++;
                    await this.reportFail(testClass, test, e);
                }
            }

            await this.runAfterHook(testClass);

            this.logNewLine();
            this.log('INFO', `End of test class: ${testClass.name}`);
        }

        this.log('INFO', 'End of tests');
        this.stdout(`test-stats=${JSON.stringify(stats)}`);

        this.sendLogs();

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

    private log(severity: 'SUCCESS' | 'INFO' | 'FAIL', message: string, data?: any) {

        const logFunc = severity === 'FAIL' ? this.stderr.bind(this) : this.stdout.bind(this);

        logFunc(`[${severity}] ${message}`);

        if (data && data instanceof AssertionError) {
            const error: any = data;
            logFunc('- Message: ' + error.message);
            logFunc('- Actual: ' + error.actual);
            logFunc('- Expected: ' + error.expected);
            logFunc('- Stack: ' + error.stack);
        }
        else if (data && data instanceof Error) {
            logFunc(data.message);
            logFunc(data.stack);
        }
        else if (data) {
            logFunc(JSON.stringify(data, null, 2));
        }

    }

    private stdout(messageOrData) {
        console.info(messageOrData);
        this.logStack.push(messageOrData);
    }

    private stderr(messageOrData) {
        console.error(messageOrData);
        this.logStack.push(messageOrData);
    }

    private sendLogs() {
        $.post('http://localhost:5555', this.logStack.join('\n'));
    }

    private async runBeforeHook(testClass: AbstractTest) {
        try {
            const p = testClass.before();
            if (p && p.then && p.catch) {
                await p;
            }
        } catch (e) {
            await this.reportFail(testClass, {name: 'before() hook'}, e);
            throw e;
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
            throw e;
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
            throw e;
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
            throw e;
        }
    }

    private logNewLine() {
        this.log('INFO', '');
    }
}