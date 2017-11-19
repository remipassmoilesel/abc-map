import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import {Logger} from "./Logger";

export class ElectronUtilities {

    private static logger = Logger.getLogger('ElectronUtilities');
    private static DEV_ENV_VAR = 'dev';

    public static isDevMode() {
        return process.env.NODE_ENV === '' || ElectronUtilities.DEV_ENV_VAR;
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