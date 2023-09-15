"use strict";
//import { ipcRenderer } from 'electron';
var _a, _b, _c;
var ipcRenderer = require('electron').ipcRenderer;
var fontSelector = document.getElementById('fontSelector');
var mathmlInput = document.getElementById('mathmlInput');
var fontSizeInput = document.getElementById('fontSizeInput');
var editor = document.getElementById('editor');
if (editor) {
    ipcRenderer.on('request-content', function () {
        ipcRenderer.send('content-received', editor.value);
    });
}
function addEquation() {
    var mathmlCode = prompt("Enter your MathML content:");
    if (mathmlCode && editor) {
        editor.innerHTML += mathmlCode;
    }
}
function saveFile() {
    ipcRenderer.send('save-file');
}
function loadFile() {
    ipcRenderer.send('load-file');
}
function increaseFontSize() {
    if (editor) {
        var currentSize = window.getComputedStyle(editor).getPropertyValue('font-size');
        var newSize = (parseFloat(currentSize) + 2) + "px";
        editor.style.fontSize = newSize;
    }
}
function decreaseFontSize() {
    if (editor) {
        var currentSize = window.getComputedStyle(editor).getPropertyValue('font-size');
        var newSize = (parseFloat(currentSize) - 2) + "px";
        editor.style.fontSize = newSize;
    }
}
ipcRenderer.on('set-font', function (event, font) {
    if (editor) {
        document.execCommand('fontName', false, font);
    }
});
ipcRenderer.on('load-file-content', function (event, content) {
    if (editor) {
        editor.value = content;
    }
});
(_a = document.getElementById("boldButton")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    // Toggle bold for the selected text in the editor
    document.execCommand('bold', false);
});
(_b = document.getElementById("italicButton")) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    // Toggle italics for the selected text in the editor
    document.execCommand('italic', false);
});
(_c = document.getElementById("underlineButton")) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    // Toggle underline for the selected text in the editor
    document.execCommand('underline', false);
});
fontSizeInput.addEventListener('input', function () {
    var editor = document.getElementById('editor');
    var newFontSize = fontSizeInput.value;
    if (newFontSize && !isNaN(Number(newFontSize))) {
        editor.style.fontSize = newFontSize + 'px';
    }
});
