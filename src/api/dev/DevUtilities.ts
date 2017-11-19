import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import * as CircularJSON from 'circular-json';
import {Logger} from "./Logger";

export class DevUtilities {

    private static logger = Logger.getLogger('DevUtilities');
    private static DEV_ENV_VAR = 'dev';

    public static isDevMode() {
        return process.env.NODE_ENV === '' || DevUtilities.DEV_ENV_VAR;
    }

    public static setupDevTools() {

        // install VueJS dev tools
        installExtension(VUEJS_DEVTOOLS)
            .then((name) => DevUtilities.logger.info(`Added Extension:  ${name}`))
            .catch((err) => DevUtilities.logger.error('An error occurred: ', err));

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

    public static safeStringify(data: any) {
        return CircularJSON.stringify(data);
    }
}