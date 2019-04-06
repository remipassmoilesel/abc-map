
require('source-map-support').install();

import { app, BrowserWindow } from "electron";

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600, show: false });
    win.setMenu(null);
    win.setMenuBarVisibility(false);
    win.maximize();
    win.loadURL("http://localhost:8080");

    win.once('ready-to-show', () => {
        win && win.show()
    });

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
    // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
    if (win === null) {
        createWindow();
    }
});
