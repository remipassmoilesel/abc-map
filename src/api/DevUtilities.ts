import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';

export class DevUtilities {

    private static DEV_ENV_VAR = 'dev';

    public static isDevMode() {
        return process.env.NODE_ENV === '' || DevUtilities.DEV_ENV_VAR;
    }


    public static setupDevTools() {

        // install VueJS dev tools
        installExtension(VUEJS_DEVTOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.error('An error occurred: ', err));

        // setup hot reloading
        // TODO: FIXME
        // require('electron-hot')();

    }


}