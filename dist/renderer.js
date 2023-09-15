"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c, _d;
var ipcRenderer = require('electron').ipcRenderer;
var fontSelector = document.getElementById('fontSelector');
var mathmlInput = document.getElementById('mathmlInput');
var fontSizeInput = document.getElementById('fontSizeInput');
var editor = document.getElementById('editor');
var Nodehun = require('nodehun');
var fs = require('fs');
// Load dictionaries
var affix = fs.readFileSync('Wordy/dictionaries/en_US/en_US.aff');
var dictionary = fs.readFileSync('Wordy/dictionaries/en_US/en_US.dic');
// Initialize nodehun
var nodehun = new Nodehun(affix, dictionary);
// Function to check spelling
function checkSpelling(word) {
    return new Promise(function (resolve, reject) {
        nodehun.spellSuggest(word, function (err, correct, suggestion, origWord) {
            if (err)
                reject(err);
            resolve({ correct: correct, suggestion: suggestion });
        });
    });
}
// TODO: Integrate checkSpelling with your editor to highlight misspelled words
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
ipcRenderer.on('load-file-content', function (event, content, fileType) {
    var editor = document.getElementById('editor');
    if (!editor)
        return;
    switch (fileType) {
        case '.txt':
        case '.rtf':
            editor.innerText = content;
            break;
        case '.wrdy':
            try {
                var parsedContent = JSON.parse(content);
                editor.innerText = parsedContent.text || '';
            }
            catch (error) {
                console.error('Error parsing .wrdy file:', error);
            }
            break;
        default:
            editor.innerText = content;
            break;
    }
});
//    if (editor) {
//        editor.value = const content: any;
//    }
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
(_d = document.getElementById('editor')) === null || _d === void 0 ? void 0 : _d.addEventListener('input', function () {
    var editor = document.getElementById('editor');
    if (!editor)
        return;
    var words = (editor === null || editor === void 0 ? void 0 : editor.innerText.split(/\s+/)) || [];
    words.forEach(function (word) { return __awaiter(void 0, void 0, void 0, function () {
        var correct, highlighted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkSpelling(word)];
                case 1:
                    correct = (_a.sent()).correct;
                    if (!correct) {
                        highlighted = "<span class=\"misspelled\">".concat(word, "</span>");
                        editor.innerHTML = editor.innerHTML.replace(word, highlighted);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
