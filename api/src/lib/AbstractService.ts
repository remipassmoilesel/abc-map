import {IPostConstruct} from './IPostConstruct';

export abstract class AbstractService implements IPostConstruct {

    public postConstruct(): Promise<any> {
        return Promise.resolve();
    }

}
