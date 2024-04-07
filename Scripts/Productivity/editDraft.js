// Edit Draft
// Based upon [Ask ChatGPT](https://directory.getdrafts.com/a/2J8)

// Constants
const models = [
   "gpt-3.5-turbo",
   "gpt-4",
   "gpt-4-turbo-preview"
]
const editPrompt = "Edit for spelling, grammar, clarity, and conciseness:";
const testingAnswer = "This is a mock chat response.";

// Configuration
const selectedModel = 2;
const testing = false;

// Get selection
let bottomSeperator = true;
let cursorLoc = editor.getSelectedRange()[0];
let initialText = editor.getSelectedText();
if (!initialText) {
   // Get full text of draft
   initialText = editor.getText();
   editor.setSelectedRange(0, initialText.length);
   bottomSeperator = false;
   cursorLoc = 0;
}

// Prep chat request
let chatPrompt = editPrompt + " " + initialText;
let ai = new OpenAI();
ai.model = models[selectedModel];

// Process chat response
let answer = !testing ? ai.quickChatResponse(chatPrompt) : testingAnswer;
if (!answer || answer.length == 0) {
   answer = "No reply received";
}

// Format response
let updatedContent = `${initialText}

---

${answer}`;
if (bottomSeperator) {
   updatedContent += "\n\n---";
}

// Update draft and select response
editor.setSelectedText(updatedContent);
let newCursorLoc = cursorLoc + initialText.length + 7;
editor.setSelectedRange(newCursorLoc, answer.length);