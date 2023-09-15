"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = __importStar(require("fs"));
var mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('save-file', function (event) {
    if (mainWindow) {
        mainWindow.webContents.send('request-content');
    }
});
electron_1.ipcMain.on('content-received', function (event, content) {
    electron_1.dialog.showSaveDialog({
        title: 'Save text output',
        filters: [
            { name: 'Text Files', extensions: ['txt'] }
        ]
    }).then(function (result) {
        if (!result.canceled && result.filePath) {
            if (typeof content === 'string') {
                fs.writeFileSync(result.filePath, content);
            }
        }
    });
});
electron_1.ipcMain.on('load-file', function (event) {
    electron_1.dialog.showOpenDialog({
        title: 'Open text file',
        filters: [
            { name: 'Text Files', extensions: ['txt'] }
        ],
        properties: ['openFile']
    }).then(function (result) {
        if (!result.canceled && result.filePaths[0]) {
            var content = fs.readFileSync(result.filePaths[0], 'utf8');
            if (mainWindow) {
                mainWindow.webContents.send('load-file-content', content);
            }
        }
    });
});
