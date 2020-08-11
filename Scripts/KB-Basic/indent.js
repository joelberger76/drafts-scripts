// Indent

// character string used for indent
let indent = "    ";
if (draft.languageGrammar == "Taskpaper") {
	indent = "\t";
}
else if (draft.languageGrammar == "GitHub Markdown") {
   indent = "   ";
}

// grab ranges and text
let [selStart, selLen] = editor.getSelectedRange();
let [lnStart, lnLen] = editor.getSelectedLineRange();
let lnText = editor.getTextInRange(lnStart, lnLen);

// loop over lines and add indents skipping blank lines
let indentedLines = [];
let indentCt = 0;
let fl = false;
if (lnText.endsWith("\n")) {
	lnText = lnText.slice(0, -1);
	fl = true;
}
let lines = lnText.split("\n");
for(let line of lines) {
	if (line.length > 0) {
		indentedLines.push(indent + line);
		indentCt++;
	}
	else {
		indentedLines.push(line);
	}
}

// set text
let resultText = indentedLines.join("\n");
if (fl) { resultText = resultText + "\n"; }
editor.setTextInRange(lnStart, lnLen, resultText);

// update selection
let newStart = selStart + indent.length;
let newLen = selLen + (indent.length * (indentCt - 1))
editor.setSelectedRange(newStart, newLen);
