const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile('./renderer/index.html');
}

app.on('ready', createMainWindow);

ipcMain.on('navigate', (event, page) => {
    mainWindow.loadFile(`./renderer/views/${page}.html`);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
