import {app, BrowserWindow, globalShortcut} from 'electron';
import * as url from 'url';
import {ElectronUtilities} from './api/dev/ElectronDevUtilities';
import {Logger} from './api/dev/Logger';
import {initApplication, stopApplication} from './api/main';
import {Ipc} from './api/ipc/Ipc';
import * as sourceMapSupport from 'source-map-support';
import * as paths from '../config/paths';

sourceMapSupport.install();

const logger = Logger.getLogger('electron-main.ts');

logger.info('');
logger.info('');
logger.info('=============================');
logger.info('Starting Abc-Map application');
logger.info(`NODE_ENV=${process.env.NODE_ENV}`);
logger.info('=============================');
logger.info('');
logger.info('');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

async function createWindow() {

    // Create the browser window.
    win = new BrowserWindow({
        height: 768,
        webPreferences: {
            nodeIntegration: true,
        },
        width: 1024,
    });
    win.setMenu(null);
    win.maximize();

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: paths.INDEX_DEST,
        protocol: 'file:',
        slashes: true,
    }));

    if (ElectronUtilities.isDevMode()) {
        logger.info(' ** Dev mode enabled, installing dev tools ** ');
        ElectronUtilities.setupDevTools();
    }

    // Open the DevTools.
    setTimeout(() => {
        win.webContents.openDevTools();
    }, 500);

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // init api application
    const ipc = Ipc.newInstance(win.webContents);

    const services = await initApplication(ipc);

    if (ElectronUtilities.isDevMode()) {
        logger.info('Setting up dev project.');
        await services.project.setupDevProject();
    }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', async () => {

    logger.info('All windows are closed, shutting down app ...');

    try {
        await stopApplication();
        logger.info('Database closed, quitting app');
        app.exit(0);
    } catch (error) {
        logger.error('Error while closing app, quitting app. Error: ', error);
        app.exit(1);
    }

});

process.on('exit', (code) => {
    logger.info(`Process will exit with code ${code}`);
});

// listen for unhandled rejections and uncaught errors
process.on('unhandledRejection', (reason, p) => {
    logger.error('[UNHANDLED REJECTION ERROR]', {reason, p});
});

process.on('uncaughtException', (err) => {
    logger.error('[UNCAUGHT ERROR]', {error: err});
});
