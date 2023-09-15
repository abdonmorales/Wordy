//import { ipcRenderer } from 'electron';
interface SpellingCheckResult {
    correct: boolean;
    suggestion?: string;
}

const { ipcRenderer } = require('electron');
const fontSelector = document.getElementById('fontSelector')! as HTMLSelectElement;
const mathmlInput = document.getElementById('mathmlInput')! as HTMLInputElement;
const fontSizeInput = document.getElementById('fontSizeInput') as HTMLInputElement;
const editor = document.getElementById('editor')! as HTMLTextAreaElement;
const Nodehun = require('nodehun');
const fs = require('fs');

// Load dictionaries
const affix = fs.readFileSync('Wordy/dictionaries/en_US/en_US.aff');
const dictionary = fs.readFileSync('Wordy/dictionaries/en_US/en_US.dic');

// Initialize nodehun
const nodehun = new Nodehun(affix, dictionary);

// Function to check spelling
function checkSpelling(word: string): Promise<SpellingCheckResult> {
    return new Promise((resolve, reject) => {
        nodehun.spellSuggest(word, (err: any, correct: boolean, suggestion: string, origWord: string) => {
            if (err) reject(err);
            resolve({ correct, suggestion });
        });
    });
}

// TODO: Integrate checkSpelling with your editor to highlight misspelled words

if (editor) {
    ipcRenderer.on('request-content', () => {
        ipcRenderer.send('content-received', editor.value);
    });
}

function addEquation() {
    const mathmlCode = prompt("Enter your MathML content:");
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
        const currentSize = window.getComputedStyle(editor).getPropertyValue('font-size');
        const newSize = (parseFloat(currentSize) + 2) + "px";
        editor.style.fontSize = newSize;
    }
}

function decreaseFontSize() {
    if (editor) {
        const currentSize = window.getComputedStyle(editor).getPropertyValue('font-size');
        const newSize = (parseFloat(currentSize) - 2) + "px";
        editor.style.fontSize = newSize;
    }
}

ipcRenderer.on('set-font', (event, font) => {
    if (editor) {
        document.execCommand('fontName', false, font);
    }
});

ipcRenderer.on('load-file-content', (event, content) => {
    if (editor) {
        editor.value = content;
    }
});
document.getElementById("boldButton")?.addEventListener('click', () => {
    // Toggle bold for the selected text in the editor
    document.execCommand('bold', false);
});

document.getElementById("italicButton")?.addEventListener('click', () => {
    // Toggle italics for the selected text in the editor
    document.execCommand('italic', false);
});

document.getElementById("underlineButton")?.addEventListener('click', () => {
    // Toggle underline for the selected text in the editor
    document.execCommand('underline', false);
});
fontSizeInput.addEventListener('input', () => {
    const editor = document.getElementById('editor') as HTMLElement;
    const newFontSize = fontSizeInput.value;
    if (newFontSize && !isNaN(Number(newFontSize))) {
        editor.style.fontSize = newFontSize + 'px';
    }
});
document.getElementById('editor')?.addEventListener('input', () => {
const editor = document.getElementById('editor');
    if (!editor) return;
        const words = editor?.innerText.split(/\s+/) || [];

        words.forEach(async word => {
            const { correct } = await checkSpelling(word);
            if (!correct) {
                // Highlight the word
                // This will wrap the word in a <span> with a specific class
                const highlighted = `<span class="misspelled">${word}</span>`;
                editor.innerHTML = editor.innerHTML.replace(word, highlighted);
            }
        });
});