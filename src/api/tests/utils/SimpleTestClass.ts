
// TODO: test with all primitive types
// TODO: and throw errors if constructor is unknown

export class SimpleTestClass {
    public field1: string;
    public field2: NestedTestClass;
    public field3: number = 5;
    public field4: boolean = false;

    constructor(value1: string) {
        this.field1 = value1;
    }

    public generateDate(){
        return new Date();
    }
}

export class SimpleTestClass2 {
    public field1: string;
    public field2: NestedTestClass[];

    constructor(value1: string) {
        this.field1 = value1;
    }
}

export class SimpleTestClass3 {
    public field1: string;
    public field2: Date = new Date();

    constructor(value1: string) {
        this.field1 = value1;
    }
}

export class NestedTestClass {
    public field3: string;
    public field4: NestedTestClass;

    constructor(value3: string) {
        this.field3 = value3;
    }
}
