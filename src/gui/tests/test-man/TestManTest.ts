import {AbstractTest} from "./AbstractTest";

export class TestManTest extends AbstractTest {

    public name: string = 'TestManTest';

    private beforeCall: number;
    private firstTestCall: number;
    private secondTestCall: number;
    private afterCall: number;

    public registerTests(): any[] {
        return [
            this.firstTest,
            this.secondTest
        ];
    }

    public before() {
        this.beforeCall = new Date().getTime();
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 300);
        });
    }

    public firstTest() {
        this.firstTestCall = new Date().getTime();
        const elapsedTime = this.firstTestCall - this.beforeCall;
        this.assert.isTrue(elapsedTime >= 300, `Elapsed time should be greater than 300: ${elapsedTime}`);

        return new Promise((resolve, reject) => {
            setTimeout(resolve, 300);
        });
    }

    public secondTest() {
        this.secondTestCall = new Date().getTime();
        const elapsedTime = this.secondTestCall - this.firstTestCall;
        this.assert.isTrue(elapsedTime >= 300, `Elapsed time should be greater than 300: ${elapsedTime}`);

        return new Promise((resolve, reject) => {
            setTimeout(resolve, 300);
        });
    }

    public after() {
        this.afterCall = new Date().getTime();
        const elapsedTime = this.afterCall - this.secondTestCall;
        this.assert.isTrue(elapsedTime >= 300, `Elapsed time should be greater than 300: ${elapsedTime}`);

        return new Promise((resolve, reject) => {
            setTimeout(resolve, 300);
        });
    }


}
