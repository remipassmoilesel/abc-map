import * as chai from 'chai';
import * as sinon from 'sinon';

export abstract class AbstractTest {

    public abstract name: string;

    public chai = chai;
    public sinon = sinon;
    public assert = chai.assert;

    public tests: any[] = [];

    public addTest(test: any) {
        this.tests.push(test);
    }

    public before(): Promise<any> | void {

    }

    public after(): Promise<any> | void {

    }

    public beforeEach(): Promise<any> | void {

    }

    public afterEach(): Promise<any> | void {

    }

}