/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');

/**
 * Creates the main browser window.
 */
function createWindow() {
  const window = new electron.BrowserWindow();
  window.loadFile('index.html');
}

electron.app.whenReady().then(() => {
  createWindow();

  electron.app.on('activate', () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});
