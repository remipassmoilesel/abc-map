/** tslint:disable:no-empty */
import * as chai from 'chai';
import * as sinon from 'sinon';
import {ClientGroup} from '../../lib/clients/ClientGroup';

export abstract class AbstractTest {

    public abstract name: string;
    public only = false;

    public chai = chai;
    public sinon = sinon;
    public assert = chai.assert;

    public clients = new ClientGroup();

    public tests: any[] = [];

    constructor() {
        this.tests = this.registerTests();
    }

    public abstract registerTests(): any[];

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
