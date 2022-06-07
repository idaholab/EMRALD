/**
 * @file Launches a self-contained instance of EMRALD in an Electron window.
 */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow } = require('electron');
const electronSquirrelStartup = require('electron-squirrel-startup');

if (electronSquirrelStartup) {
  app.quit();
}

/**
 * Creates the main browser window.
 */
function createWindow() {
  const window = new BrowserWindow();
  window.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
