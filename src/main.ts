import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as fs from 'fs';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('save-file', (event) => {
  if (mainWindow) {
    mainWindow.webContents.send('request-content');
  }
});

ipcMain.on('content-received', (event, content) => {
  dialog.showSaveDialog({
    title: 'Save text output',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Rich Text Files', extensions: ['rtf'] },
      { name: 'Wordy Custom Format', extensions: ['wrdy'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePath) {

      if (typeof content === 'string') {
        fs.writeFileSync(result.filePath, content);
      }

    }
  });
});

ipcMain.on('load-file', (event) => {
  dialog.showOpenDialog({
    title: 'Open text file',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Rich Text Files', extensions: ['rtf'] },
      { name: 'Wordy Custom Format', extensions: ['wrdy'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled && result.filePaths[0]) {
      const content = fs.readFileSync(result.filePaths[0], 'utf8');
      if (mainWindow) {
        mainWindow.webContents.send('load-file-content', content);
      }
    }
  });
});