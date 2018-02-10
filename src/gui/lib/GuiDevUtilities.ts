export class GuiDevUtilities {

    private static NODE_ENV_DEV = 'dev';
    private static NODE_ENV_TEST = 'test';
    private static NODE_ENV_PROD = 'prod';

    public static isDevMode() {
        return process.env.NODE_ENV !== GuiDevUtilities.NODE_ENV_PROD;
    }

    public static setupDevtron(): void {
        require('devtron').install();
    }

}
