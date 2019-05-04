export abstract class AbstractService {

    public postConstruct(): Promise<any> {
        return Promise.resolve();
    }

}
