import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import {Logger} from "./Logger";

export class ElectronUtilities {

    private static logger = Logger.getLogger('ElectronUtilities');
    private static NODE_ENV_DEV = 'dev';
    private static NODE_ENV_TEST = 'test';
    private static NODE_ENV_PROD = 'prod';

    public static isDevMode() {
        return process.env.NODE_ENV !== ElectronUtilities.NODE_ENV_PROD;
    }

    public static setupDevTools() {

        // install VueJS dev tools
        installExtension(VUEJS_DEVTOOLS)
            .then((name) => ElectronUtilities.logger.info(`Added Extension:  ${name}`))
            .catch((err) => ElectronUtilities.logger.error('An error occurred: ', err));

        // setup hot reloading
        // TODO: FIXME
        // require('electron-hot')();

    }

    /**
     * Use only on renderer process
     */
    public static setupDevtron() {
        require('devtron').install();
    }
}